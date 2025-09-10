export const formatJMD = (n:number) => new Intl.NumberFormat('en-JM',{style:'currency',currency:'JMD'}).format(n);
export const toJmdMinor = (n:number)=>Math.round(n*100);
