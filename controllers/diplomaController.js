const _ = require("lodash");
const ARRAY_CONST = 30;
const INTERVALS_CONST = 5;
const MIN = 10000;
const MAX = 17000;
const MAX_ORIGIN = 20000;

let Controller = function(){}

Controller.index = function (req, res) {
  const initialArr = _generateInitialData();
  const resultArr = _generatePredictedData();

  //res.render('index', { originArr: originArr, predictedArr: predictedArr, aGroupArr: aGroupArr });
};

function _generateInitialData() {
  const data = _fillDataToArray();
  let intervals = [];

  data.forEach(chromosome => { 
    const interval = _generateInterval(chromosome);

    intervals.push(interval);
  });

  return interval;
}

function _generatePredictedData() {
  const data = _fillDataToArray();
  const selectedInterval = _generateInterval(data[0]);
  let intervals = [];
  let lingValues = [];
  let aGroups = [];  
  let predictedValues = [];

  data.forEach(chromosome => {
      const interval = _generateInterval(chromosome);
      const lingValue = _generateLingValues(interval);
      const aGroupObj = _generateAGroup(chromosome, selectedInterval);
      const predictedValue = Math.round((aGroupObj.left+aGroupObj.right)/2) || chromosome;

      intervals.push(interval);
      lingValues.push(lingValue);
      aGroups.push(aGroupObj.aGroup);
      predictedValues.push(predictedValue);     
  });

  return {
    intervals: intervals,
    lingValues: lingValues,
    aGroups: aGroups,
    predictedValues: predictedValues
  };

}

function _fillDataToArray() {
  const array = [];

  for (let i=0; i<ARRAY_CONST; i++) {
    array.push(_.random(MIN, MAX));
  }
  return array.sort();
}

function _generateInterval(chromosome) {
  const intervalsArr = [];

  intervalsArr.push(chromosome);

  for (let i=0; i<INTERVALS_CONST; i++) {
    let value = _.random(MIN, MAX_ORIGIN);
    intervalsArr.push(value);
  }

  return intervalsArr.sort();
}

function _generateLingValues(intervalsArr) {
  const lingValues = {};
  lingValues["A1"] = 1/intervalsArr[0]+0.5/intervalsArr[1];
  lingValues["A2"] = 0.5/intervalsArr[0]+1/intervalsArr[1]+0.5/intervalsArr[2];
  lingValues["A3"] = 0.5/intervalsArr[1]+1/intervalsArr[2]+0.5/intervalsArr[3];
  lingValues["A4"] = 0.5/intervalsArr[2]+1/intervalsArr[3]+0.5/intervalsArr[4];
  lingValues["A5"] = 0.5/intervalsArr[3]+1/intervalsArr[4]+0.5/intervalsArr[5];
  lingValues["A6"] = 0.5/intervalsArr[4]+1/intervalsArr[5]+0.5/MAX_ORIGIN;
  lingValues["A7"] = 0.5/intervalsArr[5]+1/MAX_ORIGIN;
  return lingValues;
}

function _generateAGroup(chromosome, intervals) {

  if (chromosome <= intervals[0]) {
    return { aGroup: 0, left: chromosome, right: chromosome };
  }

  for (let i=1; i<intervals.length; i++) {
    let left = intervals[i-1];
    let right = intervals[i];

    if (chromosome > left && chromosome < right) {
      return { aGroup: i, left: left, right: right };
    } else {
      left = intervals[i];
      right = intervals[i+1];
    }
  }
}

module.exports = Controller;