import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { Form, useFormikContext, Formik, useField, FieldInputProps } from 'Formik'
import { InputHTMLAttributes } from 'react'
import * as Yup from 'yup'
import React from 'react'



export const Sampler = () => {
  //TODO: figure out what is this syntax
  interface xx {
    [aaaa:string]:any
  }
  const o : xx = { user:"abc", pwd:""};
  
  return (<p>{o.xyz}</p>)
}
type SFProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label: string,
}
export const SimpleField: React.FC<SFProps> = (props: SFProps) => {
  const {
    getFieldProps,
    getFieldMeta,
    getFieldHelpers,
    registerField,
    unregisterField,
  } = useFormikContext();
  console.log(getFieldProps)
  console.log(props)
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={false}>
      <label>Simple Label</label>
      <input id={field.name} type="text" defaultValue="s:val"></input>
    </FormControl>
  )
}



export const DisplayFormikState = (props: any) => {
  return (
    <div style={{ margin: '1rem 0' }}>
      <h3 style={{ fontFamily: 'monospace' }} />
      <pre
        style={{
          background: '#f6f8fa',
          fontSize: '.65rem',
          padding: '.5rem',
        }}
      >
        <strong>props</strong> ={' '}
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
  )
}

export const ViewFormikContext = () => {
  // Grab values and submitForm from context
  // const fmk = useFormikContext();
  // console.log(fmk)
  // const {
  //     getFieldProps,
  //     getFieldMeta,
  //     getFieldHelpers,
  //     registerField,
  //     unregisterField,
  //   } = fmk;
  //   console.log(getFieldProps)
  return null;
};


export const SimpleFormikForm = () => (
  <div className="app">
    <h1>
      Basic{" "}
      <a
        href="https://github.com/jaredpalmer/formik"
        target="_blank"
        rel="noopener noreferrer"
      >
        Formik
      </a>{" "}
      Demo
    </h1>
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async values => {
        await new Promise(resolve => setTimeout(resolve, 500));
        alert(JSON.stringify(values, null, 2));
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email()
          .required("Required")
      })}
    >


      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;

        return (
          <form onSubmit={handleSubmit}>
            <ViewFormikContext />
            <SimpleField name="ffname"
              placeholder="password"
              label="Password"
              type="password" />
            <label htmlFor="email" style={{ display: "block" }}>
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="text"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.email && touched.email
                  ? "text-input error"
                  : "text-input"
              }
            />
            {errors.email && touched.email && (
              <div className="input-feedback">{errors.email}</div>
            )}

            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

            <DisplayFormikState {...props} />
          </form>
        );
      }}
    </Formik>

  </div>
);



// //doesn't work, needed the children definition
// type Props = {
//     title: string,
// };
// const Page: React.FC<Props> = ({
//     title,
//     children,
// }) => (
//     <div>
//         <h1>{title}</h1>
//         {children}
//     </div>
// );

type Props = {
  title: string,
  children: React.ReactNode // needed this also
};
export class Page extends React.Component<Props> {
  render() {
      return (
          <div>
              <h1>{this.props.title}</h1>
              {this.props.children}
          </div>
      );
  }
}

interface Name {
  name: string
};

interface Age {
  age: number
};

type Person = Name & Age;

const x: Person = { name:"VRN", age:40 }



