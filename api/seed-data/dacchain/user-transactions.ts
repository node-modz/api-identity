const transactions = [
    {
        ledgerRefId: "wallet", from: 'chain.reserve@dacchain.com', to: 'chain.reserve@dacchain.com',
        txnRefId: "loan.issue:chain.reserve@dacchain.com:id:1", txnType: "loan.issue",
        txnDate: new Date("2022-01-01T14:00:00"),
        payment: {
            principal: { amount: 1000000000, currency: 'USD', description: 'seed the chain with 1B' }
        }
    },
    {
        ledgerRefId: "peer-to-peer", from: 'chain.reserve@dacchain.com', to: 'vn1@gmail.com',
        txnRefId: "seed.xfr:chain.reserve@dacchain.com:id:1", txnType: "seed.xfr",
        txnDate: new Date("2022-02-01T14:00:00"),
        payment: {
            principal: { amount: 40000, currency: 'USD', description: 'seed the chain with 1B' }
        }
    },
    {
        ledgerRefId: "peer-to-peer", from: 'chain.reserve@dacchain.com', to: 'payroll-in@wavelabs.ai',
        txnRefId: "seed.xfr:chain.reserve@dacchain.com:id:2", txnType: "seed.xfr",
        txnDate: new Date("2022-02-01T14:00:00"),
        payment: {
            principal: { amount: 60000, currency: 'USD', description: 'seed the chain with 1B' }
        }
    },
    {
        ledgerRefId: "loan:id-xxx-yyy", from: 'vn1@gmail.com', to: 'kn1@gmail.com',
        txnRefId: "loan.issue:vn1@gmail.com:id:1", txnType: "loan.issue",
        txnDate: new Date("2022-03-01T14:00:00"),
        payment: {
            principal: { amount: 1000, currency: 'USD', description: 'loan issued for loan:id-xxx-yyy' }
        }
    },
    {
        ledgerRefId: "peer-to-peer", from: 'vn1@gmail.com', to: 'kn1@gmail.com',
        txnRefId: "gift.issue:vn1@gmail.com:id:1", txnType: "gift.issue",
        txnDate: new Date("2022-04-01T14:00:00"),
        payment: {
            principal: { amount: 1500, currency: 'USD', description: 'gifted for her 1st birthday' }
        }
    },


    {
        ledgerRefId: "peer-to-peer", from: 'vn1@gmail.com', to: 'kn1@gmail.com',
        txnRefId: "gift.issue:vn1@gmail.com:id:2", txnType: "gift.issue",
        txnDate: new Date("2022-04-01T14:00:00"),
        payment: {
            principal: { amount: 500, currency: 'USD', description: 'gifted for her 2nd birthday' }
        }
    },
    {
        ledgerRefId: "loan:id-xxx-yyy", from: 'kn1@gmail.com', to: 'vn1@gmail.com',
        txnRefId: "loan.pay:kn1@gmail.com:id:1", txnType: "loan.pay",
        txnDate: new Date("2022-05-01T14:00:00"),
        payment: {
            principal: { amount: 100, currency: 'USD', description: 'loan principal pay for loan:id-xxx-yyy' },
            interest: { amount: 10, currency: 'USD', description: 'loan interest pay for loan:id-xxx-yyy' }
        }
    },
    {
        ledgerRefId: "loan:id-xxx-yyy", from: 'kn1@gmail.com', to: 'vn1@gmail.com',
        txnRefId: "loan.pay:kn1@gmail.com:id:2", txnType: "loan.pay",
        txnDate: new Date("2022-05-01T14:00:00"),
        payment: {
            principal: { amount: 100, currency: 'USD', description: 'loan principal pay for loan:id-xxx-yyy' },
            interest: { amount: 10, currency: 'USD', description: 'loan interest pay for loan:id-xxx-yyy' }
        }
    },
    {
        ledgerRefId: "peer-to-peer", from: 'payroll-in@wavelabs.ai', to: 'vn1@gmail.com',
        txnRefId: "salary.pay:payroll-in@wavelabs.ai:id:1", txnType: "salary.pay",
        txnDate: new Date("2022-06-01T14:00:00"),
        payment: {
            principal: { amount: 10000, currency: 'USD', description: 'salary for month of 2022 jan' },
        }
    },
    {
        ledgerRefId: "peer-to-peer", from: 'payroll-in@wavelabs.ai', to: 'vn1@gmail.com',
        txnRefId: "salary.pay:payroll-in@wavelabs.ai:id:2", txnType: "salary.pay",
        txnDate: new Date("2022-07-01T14:00:00"),
        payment: {
            principal: { amount: 10000, currency: 'USD', description: 'salary for month of 2022 feb' },
        }
    }
]

export default transactions;  