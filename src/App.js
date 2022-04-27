import './App.css';
import * as React from "https://cdn.skypack.dev/react@17.0.1";

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      currentPressed: "0",
      runningTotal: 0
    };
    this.handleButton = this.handleButton.bind(this);
    this.handleExpression = this.handleExpression.bind(this);
  }

  handleExpression(expression){
    let result = 0;
    let operators = [];
    let operands = [];
    let temp_operand = "";

    for (let i = 0; i < expression.length; i++){
       if (expression[i] != "+" && expression[i] != "/" && expression[i] != "*" && (expression[i] != "-" || (expression[i] === "-" && i == 0) || (expression[i] === "-" && (expression[i-1] === "-" || expression[i-1] === "+" || expression[i-1] === "/" || expression[i-1] === "*")))){
         temp_operand += expression[i];
       } else
       {
         operators.push(expression[i]);
         operands.push(temp_operand)
         temp_operand = "";
       }
    }
    //get whatever is after the last operator
    if (temp_operand != "") {
      operands.push(temp_operand)
    } 

    //we now have a list of operators and operands
    //1. iterate through operators 
    //2. apply operator to first two 
    //3. store result in first position and remove second operand
    //4. Continue this until all has been iterated over.
    let i = 0
    let to_remove = 1
    let first = operands[0]

    while (operands.length > 1){    
      let second = operands[1]
      if (operators[i] === "+"){
        first = parseFloat(first) + parseFloat(second);
      }
      else if (operators[i] === "-"){
        first = parseFloat(first) - parseFloat(second);
      }
      else if (operators[i] === "/"){
        first = parseFloat(first) / parseFloat(second);
      }
      else if (operators[i] === "*"){
        first = parseFloat(first) * parseFloat(second);
      }
      //remove second
      operands.splice(1,1)
      i++;
    }
    
    result = first; 
    return result;  
  }
  
  handleButton(buttonPressed) {
    if (buttonPressed === "="){
      let result = this.handleExpression(this.state.currentPressed);
      this.setState({
        currentPressed: result 
      });
    } else if (buttonPressed === "CLEAR"){
      this.setState({
        currentPressed: 0,
        runningTotal: 0
      })
    } else {
      let valid = true;
      //first check is to check for multiple zeros at the start
      if ((this.state.currentPressed === "0" || this.state.currentPressed === 0) && buttonPressed === "0"){
        valid = false;
      }
      
      let strPressed = String(this.state.currentPressed)
      //second check is to check if there are too many decimal places  
      if (buttonPressed === "."){
        let decimalCount = (String(this.state.currentPressed).match(/\./g) || []).length;
        let operatorCount = 0;
        
        
        for (let i=0; i<strPressed.length; i++){
          if (strPressed[i] === "+" || strPressed[i] === "-" || strPressed[i] === "/" || strPressed[i] === "*"){
            operatorCount++;
          }
        }        
        if (decimalCount + 1 > operatorCount + 1){ 
          valid = false;  
        }
      }
      //third check is to check if there are too many operators
      if (buttonPressed === "+" || buttonPressed === "/" || buttonPressed === "*"){
        let lastChr = strPressed.slice(-1)
        if (lastChr === "+" || lastChr === "/" || lastChr === "*" || lastChr === "-"){
          let fixed = strPressed.replace(/.$/,buttonPressed) 
          this.setState({
            currentPressed: fixed
          })
          valid = false;
          
          //now we need to check if theres more than one operator at the end
          // if there is replace again 
          let firstLast = String(fixed).slice(-1);
          let secondLast = String(fixed).slice(-2,-1);
          
          //check if the last two are operators
          //if they are delete the last character and replace the other 
          // with the previous last
          let customOperators = ["+", "-", "/", "*"]
          
          if (customOperators.includes(firstLast) && customOperators.includes(secondLast)){
            //remove the last
            fixed = fixed.slice(0, -1) 
            //replace the last with secondLast
            fixed = fixed.replace(/.$/,firstLast)
            this.setState({
              currentPressed: fixed
            })
          }
          
        }
      }
      
      if (valid){
        if (this.state.currentPressed != "0"){
          this.setState({
            currentPressed: this.state.currentPressed + buttonPressed
          });  
        } else {
          this.setState({
            currentPressed: buttonPressed
          });
        }
      }
    }
  }
  
  render () {
    return(
      <div className="main">
        <div className="calculator nice-font">
         <h1 className="title">Calculator</h1>
          <Screen current_number={this.state.currentPressed}/>
          <div className="button-container">
          <Button handler={this.handleButton} id="one"display={"1"}/>
          <Button handler={this.handleButton} id="two"display={"2"}/>
          <Button handler={this.handleButton} id="three"display={"3"}/>
          <Button handler={this.handleButton} id="four"display={"4"}/>
          <Button handler={this.handleButton} id="five"display={"5"}/>
          <Button handler={this.handleButton} id="six"display={"6"}/>
          <Button handler={this.handleButton} id="seven"display={"7"}/>
          <Button handler={this.handleButton} id="eight" display={"8"}/>
          <Button handler={this.handleButton} id="nine" display={"9"}/>
          <Button handler={this.handleButton} id="zero" display={"0"}/>
          <Button handler={this.handleButton} id="add" display={"+"}/>
          <Button handler={this.handleButton} id="subtract" display={"-"}/>
          <Button handler={this.handleButton} id="multiply" display={"*"}/>
          <Button handler={this.handleButton} id="divide" display={"/"}/>
          <Button handler={this.handleButton} id="decimal" display={"."}/>
          <Button handler={this.handleButton} id="equals" display={"="}/>
          <Button handler={this.handleButton} id="clear" display={"CLEAR"}/>
          </div>
        </div>
      </div>
    );
  };
};

class Screen extends React.Component {
  
  constructor(props){
    super(props);
  }
  
  
  render () {
    return (
      <div id="display" className="screen">
        <p id="display">{this.props.current_number}</p>
      </div> 
    )
  } 
}

class Button extends React.Component {
  
  constructor(props) {
    super(props);    
    this.state = {
      setKey: this.props.handler,
      value: this.props.display
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange = (props) => {
    this.state.setKey(this.state.value);
  }
  
  render () {
    return (
      <div>
        <p>{this.props.button_name} </p>
        <button id={this.props.id} onClick={this.handleChange}>
          {this.props.display}
        </button>
      </div>
    )
  }
}

export default App;
