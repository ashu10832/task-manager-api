const calculateTip = (total,tipPercent)=> total*tipPercent

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const add = (a,b) => {

    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            if(a>0 && b>0){
                resolve(a+b)
            }
            reject('Numbers must be positive')
        },2000)
    })
}


module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}