function sum(numArray){
    return numArray.reduce((val,cur) => val + cur ,0)
}

function squareOfSum(numArray){
    return Math.pow(sum(numArray),2)
}

function sumOfSquares(numArray){
    const squares = numArray.map(num => Math.pow(num,2))
    return sum(squares)
}



function parsePairs(pairs){
    const object = {
        x:[],
        y:[]
    }

    for(let i = 0; i < pairs.length; i++){
        object.x.push(pairs[i][0])
        object.y.push(pairs[i][1])
    }

    return object
}

function getSumOfProducts(x,y){
    if(x.length !== y.length){
        return undefined
    }
    let sum = 0
    for(let i = 0; i < x.length; i++){
        sum += (x[i] * y[i])
    }
    return sum
}

function getAandBOfRegressionLine(pairs){
    const {x,y} = parsePairs(pairs)
    const length = pairs.length
    const b = ((length * getSumOfProducts(x,y)) - (sum(x) * sum(y)))/((length * sumOfSquares(x)) - (squareOfSum(x)))
    const a = (sum(y) - (b * sum(x)))/ length
    return {a,b}
}

function getCorelationCoeficient(pairs){
    const {x,y} = parsePairs(pairs)
    const length = pairs.length
    return ((length * getSumOfProducts(x,y)) - (sum(x) * sum(y)))/
            (Math.sqrt((length * sumOfSquares(x)) - squareOfSum(x)) * Math.sqrt((length * sumOfSquares(y)) - squareOfSum(y)))
}

function getCorrelationDetermination(correlationCoeffecient){
    return Math.pow(correlationCoeffecient,2) * 100
}


const pairs = [
    [3.3,5.2],
    [6.2,8.0],
    [11.0,10.8],
    [9.1,7.9],
    [5.8,6.8],
    [6.5,6.9],
    [7.6,9.0]
]
