class FinanceMaths{
    static SimpleInterest = class {
        static futureValue(principle,rate,noOfYears){
            return principle * (1 + (rate * noOfYears))
        }
        static getInterest(principle,rate,noOfYears){
            return principle * rate * noOfYears
        }
        static presentValue(futureValue, rate, noOfYears){
            return futureValue / (1 + rate * noOfYears)
        }

        static getRate(futureValue,presentValue,noOfYears){
            return (futureValue/presentValue - 1) * 1/ noOfYears
        }

        static getNoOfYears(futureValue,presentValue,rate){
            return (futureValue/presentValue - 1) * 1/ rate
        }
    }

    static CompoundInterest = class {
        static futureValue(princple,rate,periodsPerYear,noOfYears){
            return princple * Math.pow(1 + rate/ periodsPerYear,periodsPerYear * noOfYears)
        }
        static presentValue(futureValue,rate,periodsPerYear,noOfYears){
            return futureValue / Math.pow(1 + rate/periodsPerYear,periodsPerYear * noOfYears)
        }

        static getRate(futureValue,presentValue,periodsPerYear,noOfYears){
            return (Math.pow(futureValue/presentValue,1/(noOfYears * periodsPerYear)) - 1) * periodsPerYear
        }

        static getNoOfYears(futureValue,presentValue,rate,periodsPerYear){
            return (Math.log(futureValue/presentValue)/Math.log(1 + rate/periodsPerYear))/periodsPerYear
        }
    }

    static Annuities = class {
        static futureValue(payments,rate,periodsPerYear,noOfYears){
            const i = rate/ periodsPerYear
            return payments * (Math.pow(1 + i,noOfYears * periodsPerYear) - 1)/ i
        }

        static getPayments(futureValue,rate,periodsPerYear,noOfYears){
            const i = rate / periodsPerYear
            return futureValue * i/(Math.pow(1 + i,periodsPerYear * noOfYears) - 1)
        }

        static getRate(FV, P, periodsPerYear,noOfYears, guess = 5, tolerance = 0.00001, maxIterations = 1000) {
            let r = guess / 100;
            let iteration = 0;
          
            while (iteration < maxIterations) {
              let i = r/periodsPerYear
              let calcFV = P * ((Math.pow(1 + i, noOfYears * periodsPerYear) - 1) / i);
              
              let diff = FV - calcFV;
              
              if (Math.abs(diff) < tolerance) {
                return r; // return rate as percentage
              }
          
              // Adjust r: simple incremental adjustment
              r += diff > 0 ? 0.0001 : -0.0001;
              iteration++;
            }
          
            return null; // didn't converge
          }
        
        static getNoOfYears(futureValue,payments,rate,periodsPerYear){
            const i = rate/periodsPerYear
            return (Math.log((futureValue * rate)/payments + 1)/Math.log(1 + i))/periodsPerYear
        }

        static getPresentValue(payments,rate,periodsPerYear,noOfYears){
            const i = rate/periodsPerYear
            const pow = Math.pow(1 + i,noOfYears * periodsPerYear)
            return payments * ((pow - 1)/(i * pow))
        }
          
          
    }

    static Amortisation = class {
        static getPayments(presentValue,rate,periodsPerYear,noOfYears){
            const i = rate/periodsPerYear
            const pow = Math.pow(1 + i,periodsPerYear * noOfYears)
            return presentValue * ((i * pow)/(pow - 1))
        }
        
        static BalanceAfterKPayments(presentValue,payments,rate,periodsPerYear,Kyears){
        	const i = rate/periodsPerYear
        	const pow = Math.pow(1 + i,periodsPerYear * Kyears)
        	return (presentValue * pow) - (payments * ((pow - 1)/i))
        }
    }
}

export default FinanceMaths
//module.exports = FinanceMaths
