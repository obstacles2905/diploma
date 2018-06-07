const _ = require("lodash");
const ARRAY_CONST = 30;
const INTERVALS_CONST = 5;
const CROSSOVER_ITERATIONS = 400;
const MIN = 10000;
const MAX = 17000;
const MAX_ORIGIN = 20000;

let Controller = function(){}

Controller.index = function (req, res) {
  const initialArr = _generateInitialData(ARRAY_CONST);
  const resultArr = _generatePredictedData(ARRAY_CONST);

  let crossoverArr = _crossOver(resultArr);
  const MSEarr = _calculateMSE(initialArr, crossoverArr);
  crossoverArr = _assignMSE(crossoverArr, MSEarr);
  crossoverArr = _optimize(crossoverArr);
  //res.render('index', { originArr: originArr, predictedArr: predictedArr, aGroupArr: aGroupArr });
};

function _generateInitialData(arrLength) {
  const data = _fillDataToArray(arrLength);
  let intervals = [];

  data.forEach(chromosome => { 
    const interval = _generateInterval(chromosome);

    intervals.push(interval);
  });

  return intervals;
}

function _generatePredictedData(arrLength) {
  const data = _fillDataToArray(arrLength);
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

function _fillDataToArray(arrLength) {
  const array = [];

  for (let i=0; i<arrLength; i++) {
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

function _crossOver(data) {
  const intervals = data.intervals;

  for(let i=0; i<CROSSOVER_ITERATIONS; i++) {
    let chosenChromosome1Index = _.random(0, intervals.length-1);
    let chosenChromosome2Index = _.random(0, intervals.length-1);
    let chosenGeneIndex = _.random(0, intervals[0].length-1);
    let chosenChromosome1 = intervals[chosenChromosome1Index];
    let chosenChromosome2 = intervals[chosenChromosome2Index];
    let temp = chosenChromosome1[chosenGeneIndex];
    
    chosenChromosome1[chosenGeneIndex] = chosenChromosome2[chosenGeneIndex];
    chosenChromosome2[chosenGeneIndex] = temp;
  }

  return intervals;
}

function _calculateMSE(initialArr, crossoverArr) {
  let MSEarr = [];

  for(let i=0; i<crossoverArr.length; i++) {
    const initialChromosome = initialArr[i];
    const resultChromosome = crossoverArr[i];
    let MSE = 0;
    
    for(let j=0; j<initialChromosome.length; j++) {
      let initialGene = initialChromosome[j];
      let resultGene = resultChromosome[j];
      MSE += Math.round(Math.pow(resultGene-initialGene, 2)/initialChromosome.length);
    }
    MSEarr.push(MSE);
  }

  return MSEarr;
}

function _assignMSE(crossoverArr, MSEarr) {
  for(let i=0; i<crossoverArr.length; i++) {
    crossoverArr[i].push(MSEarr[i]);
  }

  return crossoverArr;
}

function _optimize(crossoverArr) {
  const sortedArr =  _.sortBy(crossoverArr, [ genesArr => { return genesArr[6] }]);
  sortedArr.length = 20;
  const newGenerationArr = _generatePredictedData(10);
  //ошибка в этом методе, как-то неправильно генеришь новый массив из 10 элементов, проверь все плиз
  let newCrossoverArr = _crossOver(newGenerationArr);
  const newMSEarr = _calculateMSE(newGenerationArr, newCrossoverArr);
  newCrossoverArr = _assignMSE(newCrossoverArr, newMSEarr);
  console.log("///////", newCrossoverArr);
}

module.exports = Controller;