module.exports.sendHTMLfile =
   (_,res) =>  {
      const options = {
                     root: 'public',
                     headers: {
                       'x-timestamp': Date.now(),
                       'x-sent': true
                     }
                   };
      res.sendFile('share-app.html', options);
  }
