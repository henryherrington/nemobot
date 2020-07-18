'use strict';
const start = (say, sendButton) => {
	sendButton('You just need to input 3 numbers and I will sort them !', [{title: 'Sounds good 🙂', payload: '1'}]);
};


const state = (payload, say, sendButton) => {
	
	// Declare variables
	var num1, num2, num3, input_array, output_array;
	
	input_array = payload.split('~'); // 'Split' the payload, remove the '~' character, and put the 3 variables into the array : 'input_array'
	num1 = parseInt(input_array[0]); // Get the first number from input_array and store it to variable 'num1'
	num2 = parseInt(input_array[1]); // Get the second number from input_array and store it to variable 'num2'
	num3 = parseInt(input_array[2]); // Get the third number from input_array and store it to variable 'num3'
	
	// parseInt : transforms String to Integer
	
	// User inputs first number
	if(payload==='1'){
	    sendButton('Enter first 🍏 number', [{title: '0', payload: '0~N~N'}, {title: '1', payload: '1~N~N'}, {title: '2', payload: '2~N~N'}, {title: '3', payload: '3~N~N'}, {title: '4', payload: '4~N~N'}, {title: '5', payload: '5~N~N'}, {title: '6', payload: '6~N~N'}, {title: '7', payload: '7~N~N'}, {title: '8', payload: '8~N~N'}, {title: '9', payload: '9~N~N'}, {title: '10', payload: '10~N~N'}, {title: '11', payload: '11~N~N'}, {title: '12', payload: '12~N~N'}, {title: '13', payload: '13~N~N'}, {title: '14', payload: '14~N~N'}, {title: '15', payload: '15~N~N'}, {title: '16', payload: '16~N~N'}, {title: '17', payload: '17~N~N'}, {title: '18', payload: '18~N~N'}, {title: '19', payload: '19~N~N'}, {title: '20', payload: '20~N~N'}]);
	}
	
	
	// User inputs second number
	if(payload===num1+'~N~N'){
	    sendButton('Enter Second 🍊 Number', [{title: '0', payload: num1+'~0~N'}, {title: '1', payload: num1+'~1~N'}, {title: '2', payload: num1+'~2~N'}, {title: '3', payload: num1+'~3~N'}, {title: '4', payload: num1+'~4~N'}, {title: '5', payload: num1+'~5~N'}, {title: '6', payload: num1+'~6~N'}, {title: '7', payload: num1+'~7~N'}, {title: '8', payload: num1+'~8~N'}, {title: '9', payload: num1+'~9~N'}, {title: '10', payload: num1+'~10~N'}, {title: '11', payload: num1+'~11~N'}, {title: '12', payload: num1+'~12~N'}, {title: '13', payload: num1+'~13~N'}, {title: '14', payload: num1+'~14~N'}, {title: '15', payload: num1+'~15~N'}, {title: '16', payload: num1+'~16~N'}, {title: '17', payload: num1+'~17~N'}, {title: '18', payload: num1+'~18~N'}, {title: '19', payload: num1+'~19~N'}, {title: '20', payload: num1+'~20~N'}]);    
	}
	
	// User inputs third number
	if(payload===num1+'~'+num2+'~N'){
		sendButton('Enter third 🥝 number ', [{title: '0', payload: num1+'~'+num2+'~0'}, {title: '1', payload: num1+'~'+num2+'~1'}, {title: '2', payload: num1+'~'+num2+'~2'}, {title: '3', payload: num1+'~'+num2+'~3'}, {title: '4', payload: num1+'~'+num2+'~4'}, {title: '5', payload: num1+'~'+num2+'~5'}, {title: '6', payload: num1+'~'+num2+'~6'}, {title: '7', payload: num1+'~'+num2+'~7'}, {title: '8', payload: num1+'~'+num2+'~8'}, {title: '9', payload: num1+'~'+num2+'~9'}, {title: '10', payload: num1+'~'+num2+'~10'}, {title: '11', payload: num1+'~'+num2+'~11'}, {title: '12', payload: num1+'~'+num2+'~12'}, {title: '13', payload: num1+'~'+num2+'~13'}, {title: '14', payload: num1+'~'+num2+'~14'}, {title: '15', payload: num1+'~'+num2+'~15'}, {title: '16', payload: num1+'~'+num2+'~16'}, {title: '17', payload: num1+'~'+num2+'~17'}, {title: '18', payload: num1+'~'+num2+'~18'}, {title: '19', payload: num1+'~'+num2+'~19'}, {title: '20', payload: num1+'~'+num2+'~20'}]);    
	}
	
	
	if(payload===num1+'~'+num2+'~'+num3){
	    output_array=bubblesort(input_array);
	    say('Great job 😎! The result is : '+output_array[0]+','+output_array[1]+','+output_array[2]);
		sendButton('Another calculation?', [
				{title: 'Yes!', payload: 'restart'},
				'No'
			]);
	}
	return;
};

function bubblesort(arr){
    var sorted = false;
    while (sorted === false){
        sorted = true;
        for (var i=0; i<arr.length-1; i++)
        {
            if (parseInt(arr[i])>parseInt(arr[i+1])){
                [arr[i],arr[i+1]]=[arr [i+1],arr[i]];
                sorted = false;
            }
        }
        
    }
 return arr; 
}


module.exports = {
	filename: 'bubblesort',
	title: 'BubbleSort',
	introduction: [
		'Hi 🙂! We will run bubblesort 🤩!'
	],
	start: start,
	state: state
};