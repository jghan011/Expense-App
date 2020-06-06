//module budget controller

// var budgetController = (function() {
// 	var x = 23;

// 	var add = function(a) {
// 		return x + a;
// 	};

// 	return {
// 		publicTest: function(b) {
// 			return add(b);
// 		}
// 	};
// })();

//note that var x and add are both private variables...
//So what the above means is that if you type budgetController.x in the console it will print undefined
//Also if you type budgetController.add(5) it will also print undefined

//Now if you run budgetController.publicTest(5) it will print 28 cuz it's returning the function
//***This works thanks to the power of "closures". inner function hs always access to the variables and parameters of outer function even after the outer function has returned
// basically publicText method is public cuzz it was returned  and x and add were private... the c and add were uses in the closure
//later we needed controller to return 28 when called so we switch console.log(add(b)); to return add(b);
// var UIcontroller = (function() {})();

//we can pass other modules into modules see below
// var controller = (function(budgetCtrl, UICtrl) {
// 	var z = budgetCtrl.publicTest(5);

// 	return {
// 		anotherPublic: function() {
// 			console.log(z); // this return is the only way to have access to Z because z is acting as a private variable
// 			//this will print 28 on the console.log originally ehen your originall module budgetconttroller has console.log(add(b));
// 			//when we switch original budgetcontroller to return add(b)// nothing is printed but type
// 			//because you set budgetCtrl in the argument and used  budgetController first at the bottom BudgetCtrl now has all the  info of BudgetController
// 			//it's best to change the name of the argument from the original module  for modifications  purposes you never know what you alter and it can cause confusion
// 			// now after you change budgetcontorller to return add(b) go to console  and type in controller.anotherpublic(5); and it will print 28
// 		}
// 	};
// })(budgetController, UIcontroller);

//BUDGET CONTROLLER
var budgetController = (function() {
	//keeps track of all; income andexpenses
	//distinguish between income and expenses
	//some code
	//fucntion constructors can be used to instanctiaite lot of o bjects

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round(this.value / totalIncome * 100);
		} else {
			this.percentage = -1;
		}
	};
	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		(this.id = id), (this.description = description), (this.value = value);
	};

	var calculateTotal = function(type) {
		var sum = 0;
		//use type argument to select if want to use expense array  or income array
		data.allItems[type].forEach(function(cur) {
			//this cfunction can access current value  current index and also complate array but here we just want the current array
			sum += cur.value; //sum eqaual to previous sum plus current value based on Expense and Income obj
			//so the cur referse to Income or Expense obj th
		});
		data.totals[type] = sum;
		/*
		intial sum 0
		this an example of how it works
			//[200, 400, 100]
			sum = 0 + 200
			sum = 200 + 400
			sum = 600 + 100 = 700
		*/
	};
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 //means something is not existant
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;
			// [1,2,3,4,5], next ID = 6
			//ID = last ID + 1
			// the problem with the above is because ID's will deleted in the future

			//create new item basod on 'inc or 'exp type
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			//push it into our data structure
			data.allItems[type].push(newItem);

			//Return the new element
			return newItem;
		},

		deleteItem: function(type, id) {
			var ids, index;
			//id = 6
			//data.allITems[type][id]

			//inde = 3

			//loop over all the eleements
			//like for each map has access to current element current index and entire  array
			//the difference is map brings back an entire new array
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},
		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp; // we know these values are withtin the totals and  data structure
			//calulate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
			} else {
				data.percentage = -1; //basically aint nothing to calulate
			}

			// for example if you have an expense  Expense = 100 and income 200, spent 33.333% 50% = 100/200 = .5 * 100
		},
		calculatePercentages: function() {
			/*
			a=20
			b=10
			c=4-
			income = 100
			a=20/100 = 20% 
			b=10/100 =10%

			*/
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc; //this is an array
		},

		getBudget: function() {
			//having thfunctinos that retrieve data and set daya is powerful
			//return four values
			return {
				budget: data.budget, //where we store tthe result of that calculate
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},
		testing: function() {
			console.log(data);
		}
	};
	//a pubclic method that allows other  modules to add item or data structure
})();

//UI CONTROLLER
var UIcontroller = (function() {
	//some code

	var DOMstrings = {
		//store allof our strings for us so it's easy to retreive and if you need to change them you can
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensePercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec;

		/*
		+ or - before number
		exactly 2 decimal points
		comma separating the thousands

		2310.4567 -> + 2,31046
		*/

		num = Math.abs(num);
		num = num.toFixed(2); //will put exactly two decimls on each number
		// abs removes the sign of the number

		numSplit = num.split('.'); //will divide into the integer part and deicmal part of the array
		int = numSplit[0]; //integer part
		if (int.length > 3) {
			//substring allows us to only take a part of string
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //first number is the index number where we want to start and the second number is how many characters you want
		}

		dec = numSplit[1]; //decimal part

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};
	var NodeListForEach = function(list, callback) {
		for (var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	return {
		getInput: function() {
			return {
				//if we had made each of those variables they would be private and be called indepenedentky which makes things harder on you
				type: document.querySelector(DOMstrings.inputType).value, //wiill be either inc or  exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat will convert string to floating number or decimal
			};
		},
		addListItem: function(obj, type) {
			var html, newHTML;

			//1.create html string with place holder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html =
					' <div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div>     <div class="item__delete">    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html =
					'  <div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div>  <div class="item__delete">   <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div>  </div></div> ';
			}
			//2. replace placeholder text with actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			//3. The finally insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		clearFields: function() {
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
			//This method tricks the slice method to believe we are giving it an array

			//fields.slice won't work becuase that is not an array
			//all the methody that the arrays inherit from the array funct constructor are in array prototype property which means slice method must be there
			//and also since this a function you can use the call metho this tricks slice method to think we give it an array so it returns an array
			fieldsArr = Array.prototype.slice.call(fields);
			//instead of using for loop we can use for each all you have to do is call a call back function
			fieldsArr.forEach(function(current, index, array) {
				current.value = ''; //current will be the inputDescriptiion and inputValue.. "" sets the value back to empty
			});

			fieldsArr[0].focus(); //input description
		},
		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? (type = 'inc') : (type = 'exp');

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); //becuase we don't want to change the html we only want to change the text content we use this and you will see the UI change as you enter numbers in
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},
		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensePercLabel); //will return a nodelist
			//now we need to loop through the node list nodse list doesn't have for each method so we have to make a for each func with a node list so how

			NodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},
		displayMonth: function() {
			var now, year, month, months;
			var now = new Date(); //stores the date
			months = [
				'JANUARY',
				'FEBRUARY',
				'MARCH',
				'APRIL',
				'MAY',
				'JUNE',
				'JULY',
				'AUGUST',
				'SEPTEMBER',
				'OCTOBER',
				'NOVEMBER',
				'DECEMBER'
			];
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + month + ',' + ' ' + year;
		},

		changedType: function() {
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue
			);

			NodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});
			document.querySelector(DOMstrings.inputBtn).classList.toggle;
			//this is nodelist so you can't do for each
		},
		getDOMstrings: function() {
			//this will expose DOMstrings to the public so now you can call upon it in another module
			return DOMstrings;
		}
	};
})();

//GLOBAL APP CONTORLLER
var controller = (function(budgetCtrl, UICtrl) {
	//the controller tells the outer module what to do
	//lwt set up a function to call event listenedrs
	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings(); //now you have the DOMstrings in the controller

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem); //when you click on the check button it will print {type: "inc", description: "test", value: "75"} everything on the console

		document.addEventListener('keypress', function(event) {
			console.log(event);

			if (event === 13 || event.which === 13) {
				console.log('You pressed enter');
				ctrlAddItem(); //will print 68 if you check console.log after pressing enter on mac it's return
			}
		});
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};
	var updatePercentages = function() {
		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();
		// 2 . Read percentages form the budget controller
		var percentages = budgetCtrl.getPercentages();

		//3 l update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	};

	var updateBudget = function() {
		// 1. Calculate the budget
		budgetCtrl.calculateBudget();
		// 2 . Return the budget
		var budget = budgetCtrl.getBudget();
		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};
	var ctrlAddItem = function() {
		var input, newItem;
		//because newItem was returned earlier in budget controller it is now available for  in the controller module
		// 1. Get the filled input data
		input = UICtrl.getInput();
		//if itsnt a number it will return true and if it is a number it will return false
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			//2, Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value); //you create a new object and we will pass this new object into the addListItem

			//3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);
			//4. Calulate the budget
			UICtrl.clearFields();
			//5. Display the budget on the UI
			updateBudget();
			// 3. Update and show athe new budget
			//6 . Calculate and update percentage
			updatePercentages();
		}
	};
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, id;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //element where event was fired
		if (itemID) {
			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			//1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			//2. Delete the item from theUI
			UICtrl.deleteListItem(itemID);
			//3. Update and show the new budget
			updateBudget();
		}
	};

	return {
		init: function() {
			console.log('Application has started');

			UIcontroller.displayMonth();
			UICtrl.displayBudget({
				budget: 0, //this way everything starts off at 0 on the UI when someone visits the page
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(budgetController, UIcontroller);

controller.init(); //if you don't call this on the outside nothing will happen cuzz we set up a  variable  function
