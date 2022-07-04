function debounce(fn,delay){
    let timer
    return function(){
        let args = arguments
        let context = this
        timer && clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(context,arguments)
        },delay)
    }
}

function throttle(fn,delay){
    let timer
    return function(){
        let args = arguments
        let context = this
        if(!timer){
            timer = setTimeout(()=>{
                fn.apply(context,args)
                clearTimeout(timer)
                timer = null
            },delay)
        }
    }
}

function throttle2(fn,delay){
    let pretime = Date.now()
    return function(){
        let context = this
        let args = arguments
        let doTime = Date.now()
        if(doTime - pretime >= delay){
            fn.apply(context,args)
            pretime = Date.now()
        }
    }
}