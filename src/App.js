import React, { Component } from 'react';
import axios from 'axios';
import Speech from 'react-text-to-speech'
// import { PDFExtract } from 'pdf.js-extract';
import Tesseract from 'tesseract.js'
// const pdfExtract = new PDFExtract();

class App extends Component {
  state = {
    file: null,
    extractedText: '',
    url: ''
  };
  handleChange = (e) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };
  handleFileUpload = (e) => { this.setState({ file: e.target.files[0] }); }
  handleExtractText = () => { let formData = new FormData(); formData.append('file', this.state.file); axios.post('https://api.ocr.space/parse/image', formData, { headers: { 'Content-Type': 'multipart/form-data', 'apiKey': 'K88251402788957' } }).then(response => {console.log(response);
   this.setState({ ...this.state, extractedText:response.data.ParsedResults[0].ParsedText.toString().split('/r/n')[0] });
     }).catch(err => { console.log(err); }) }
  handleExtractTextEngine2 = () => {
    // let formData = new FormData(); formData.append('file', this.state.file); axios.post(' https://image-to-text-6x1s.onrender.com/extract-text', formData, { headers: { 'Content-Type': 'multipart/form-data', 'apiKey': 'K88251402788957' } }).then(response => {
    //   console.log(response);
    //   this.setState({ ...this.state, extractedText: response.data.text });
    // }).catch(err => { console.log(err); })  //using api but it is also slow bcoz api hosted on free host so commenting this but its also corret
  
    this.state.file && Tesseract.recognize(URL.createObjectURL(this.state.file)//for creating file buffer
    , 'eng',
      {
        logger: m => console.log(m)
      }).then((result) => { this.setState({...this.state,extractedText:result.data.text}); }).catch((err)=>console.log(err));
  }
  handleExtractTextWithUrl = () => {
    axios.get(`https://api.ocr.space/parse/imageurl?apikey=helloworld&url=${this.state.url}`).then(response => { this.setState({ ...this.state, extractedText: response.data.ParsedResults[0].ParsedText.toString().split('/r/n')[0] }); 
    
  }).catch(err => { console.log(err); })
  }
  render() {
   console.log('hello',this.state.file && window.URL.createObjectURL(this.state.file));
    return (
      <div className="container">
        <div className='input'>
          <input type="file" name='file' onChange={this.handleFileUpload} placeholder='choose image or pdf' accept="image/png,.pdf" />
          <button onClick={this.handleExtractTextEngine2} style={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }}>Extract Text</button>
          
        </div> //Engine 2 ,more fast,less accurate than engine 1 ,for images
        <div className='input'>
          <input type="file" name='file' onChange={this.handleFileUpload} placeholder='choose image or pdf' accept=".pdf" />
          <button onClick={this.handleExtractTextEngine2} style={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }}>Extract Text</button>

        </div> //Engine 2 ,unlimited size, for pdfs,fast,less accurate than engine 1
        <div className='input'>
          <input type="file" name='file' onChange={this.handleFileUpload} placeholder='choose image or pdf' />
          <button onClick={this.handleExtractText} style={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }}>Extract Text</button>
       
        </div> //Engine1,max upload size 1 mb,slow,more accurate,supports pdf
        <div className='input'>
          <input placeholder='inser url of pdf or image ...' style={{ flexBasis: '100%' }} name='url' onChange={this.handleChange} />
          <button onClick={this.handleExtractTextWithUrl} style={{ backgroundColor: 'blue', color: 'white', fontWeight: 'bold' }}>Extract Text</button>
        
        </div>
        //Engine 1
        <div className='input'>
          (supported formats :- pdf/jpg/jpeg/png)
        </div>
        <div className='input' style={{height:'200px'}}>
          <textarea placeholder='extracted text ...' style={{ width: '100%',color:'black',height:'100%' }} value={this.state.extractedText}></textarea>
        </div>
<Speech text={this.state.extractedText?.toString()} />
      </div>);
  };
  
}
export default App;