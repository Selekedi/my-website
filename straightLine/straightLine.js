// get equation of straight line when you have two points
export function getEquation(points){
    const firstPoint = points[0]
    const secondPoint = points[1]

    const gradient = (secondPoint[1] - firstPoint[1])/(secondPoint[0] - firstPoint[0])
    const yIntercept = gradient * -firstPoint[0] + firstPoint[1]
    return {m:gradient, c:yIntercept}
}

//get equation of straight line when you have gradient and one point
export function getEquationFromGradient(gradient,point){
    const c = gradient * -point[0] + point[1]
    return {m:gradient,c}
}

