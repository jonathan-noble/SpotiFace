let predictions = {
    "angry":50,
    "sad": 64,
    "happy":52,
    "neutral":10,
    "surprised":23,
    "scared": 5
  }

  const keys = Object.keys(predictions);
  const arrayOfPreds = keys.map(key => ({
    mood: key, 
    predict: predictions[key]
    })
  );

  console.log(arrayOfPreds);

  let highestPred = arrayOfPreds.reduce((prev, curr) => {
    return prev.predict > curr.predict ? prev : curr;
    });

  console.log(highestPred.id, highestPred.predict); 


  let orderedPred = arrayOfPreds.sort((a, b) => {
      return b.predict - a.predict;
  });
  
  console.log(orderedPred[0]);
  console.log(orderedPred[0].id);
  
  this.setState({
    predictions: orderedPred
  })

