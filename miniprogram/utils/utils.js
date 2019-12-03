function formatTime(date,idx) {
  var year = date.getFullYear()
  var month = parseInt(date.getMonth()) + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  // month = parseInt(month,10)
  if(idx==1){
    return [year, month, day].map(formatNumber).join('/') + "/" + [hour, minute].map(formatNumber).join('/')
  }
  else{
    return [year, month, day].map(formatNumber2).join('/') + "/" + [hour, minute].map(formatNumber).join('/')
    
  }
}
function formatNumber(n) {
  n = n.toString()
  return n 
}
function formatNumber2(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}  