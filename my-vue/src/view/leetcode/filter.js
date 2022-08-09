export const tranToArray = (val) =>{
    const str = val.trim().replace(/\s+|[\[\]]/g,'')
    const arr = str.split(',')
    return arr
}

export const tranLintToArray = (val) =>{
    return  val.trim().split(/\n+/g)
}