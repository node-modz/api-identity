import jwt, { Secret, SignOptions, VerifyOptions } from "jsonwebtoken";
import * as jose from 'node-jose'
import { Service } from "typedi";
import Logger from '../../../../../lib/Logger'

const logger = Logger(module);

export interface JwtInterface {
  verify(token: string, options?: VerifyOptions): Promise<Record<string, unknown>>;
  decode(encryptedData: string): null | Record<string, any> | string;
  sign(payload: string | Buffer | Record<string, unknown>, options?: SignOptions): Promise<string>;
}

@Service()
export class JwtService implements JwtInterface {
  constructor(
    private readonly secretOrPrivateKey: Secret
  ) { }

  /**
   * Asynchronously verify given token using a secret or a public key to get a decoded token
   */
  verify(token: string, options: VerifyOptions = {}): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretOrPrivateKey, options, (err, decoded: any) => {
        //console.log("verify: decoded", decoded);
        if (decoded) resolve(decoded);
        else reject(err);
      });
    });
  }

  /**
   * Returns the decoded payload without verifying if the signature is valid.
   */
  decode(encryptedData: string): null | { [key: string]: any } | string {
    return jwt.decode(encryptedData);
  }

  /**
   * Sign the given payload into a JSON Web Token string
   */
  sign(payload: string | Buffer | Record<string, unknown>): Promise<string> {
    // console.log("signing payload: ", payload);
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretOrPrivateKey, (err, encoded) => {
        if (encoded) resolve(encoded);
        else reject(err);
      });
    });
  }
}

@Service()
export class JwtKeyStoreService implements JwtInterface {
  constructor(
     readonly keyStore: jose.JWK.KeyStore,
  ) { }

  /**
   * Asynchronously verify given token using a secret or a public key to get a decoded token
   */
  verify(token: string, options: VerifyOptions = {}): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      jose.JWS
        .createVerify(this.keyStore!)
        .verify(token as any as string)
        .then(v => {
          const json = JSON.parse(v.payload.toString());
          resolve(json);
        }).catch(err => {
          reject(err)
        });
    });
  }

  /**
   * Returns the decoded payload without verifying if the signature is valid.
   */
  decode(encryptedData: string): null | { [key: string]: any } | string {
    return jwt.decode(encryptedData);
  }

  /**
   * Sign the given payload into a JSON Web Token string
   */
  sign(payload: string | Buffer | Record<string, unknown>): Promise<string> {
    // console.log("signing payload: ", payload);
    const [k] = this.keyStore.all({ use: 'sig' })
    const opt = { compact: true, jwk: k, fields: { typ: 'jwt' } }
    return new Promise((resolve, reject) => {
      jose.JWS.createSign(opt, k)
        .update(payload as string)
        .final()
        .then(result => {
          resolve(result as any as string)
        }).catch(err => {
          reject(err)
        });
    });
  }
}