function getTime(nowTime, dataTime) {
  // res.data 是包含以上定义的两条记录的数组
  let my_dataTime = dataTime.split("/")
  let my_dataTime0 = parseInt(my_dataTime[0])
  let my_dataTime1 = parseInt(my_dataTime[1])
  let my_dataTime2 = parseInt(my_dataTime[2])
  let my_dataTime3 = parseInt(my_dataTime[3])
  let my_dataTime4 = parseInt(my_dataTime[4])
  let nowTime0 = parseInt(nowTime[0])
  let nowTime1 = parseInt(nowTime[1])
  let nowTime2 = parseInt(nowTime[2])
  let nowTime3 = parseInt(nowTime[3])
  let nowTime4 = parseInt(nowTime[4])

  if (my_dataTime0 == nowTime0) {
    if (nowTime1 - my_dataTime1 >= 2) {
      return my_dataTime1 + "月" + my_dataTime2 + "日" + " " + my_dataTime3 + ":" + my_dataTime4
    } else if (nowTime1 - my_dataTime1 == 1) {
      if (my_dataTime1 == 1 || my_dataTime1 == 3 || my_dataTime1 == 5 || my_dataTime1 == 7 || my_dataTime1 == 8 || my_dataTime1 == 10 || my_dataTime1 == 12) {
        if (nowTime2 == 1 & my_dataTime2 == 31) {
          return "昨天" + my_dataTime3 + ":" + my_dataTime4
        } else {
          return (31 - my_dataTime2 + nowTime2) + "天前"
        }
      } else {
        if (nowTime2 == 1 & my_dataTime2 == 30) {
          return "昨天" + my_dataTime3 + ":" + my_dataTime4
        } else {
          return (30 - my_dataTime2 + nowTime2) + "天前"
        }
      }
    } else if (nowTime1 - my_dataTime1 == 0) {
      if (nowTime2 - my_dataTime2 == 0) {
        if (nowTime3 == my_dataTime3) {
          if (nowTime4 - my_dataTime4 > 0) {
            return (nowTime4 - my_dataTime4) + "分钟前"
          } else {
            return "刚刚"
          }
        } else {
          return (nowTime3 - my_dataTime3) + "小时前"
        }
      } else if (nowTime2 - my_dataTime2 == 1) {
        return "昨天" + my_dataTime3 + ":" + my_dataTime4
      } else if (nowTime2 - my_dataTime2 >= 1) {
        return (nowTime2 - my_dataTime2) + "天前"
      }
    }
  } else {
    return my_dataTime0 + "年" + my_dataTime1 + "月" + my_dataTime2 + "日" + " " + my_dataTime3 + ":" + my_dataTime4
  }
}

module.exports = {
  getTime: getTime
}