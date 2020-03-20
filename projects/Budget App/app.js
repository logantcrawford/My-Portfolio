// Budget Controller
var budget_controller = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calc_percentage = function(total_income) {
        if (total_income > 0) {
            this.percentage = Math.round((this.value / total_income) * 100);
        } else {
            this.percentage = -1;
        };
    };
    Expense.prototype.get_precentage = function() {
        return this.percentage;
    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculate_total = function(type) {
        var sum = 0;
        data.all_items[type].forEach(function(current_element) {
            sum = sum + current_element.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        all_items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };

    return {
        add_item: function(type, des, val) {
            var new_item, id;
            
            // Create new ID.
            if (data.all_items[type].length > 0) {
                id = data.all_items[type][data.all_items[type].length - 1].id + 1; // ID for a new item 
            } else {
                id = 0;
            }
            
            // Create new item based on 'inc' or 'exp' type.
            if (type === 'exp') {
                new_item = new Expense(id, des, val);
            } else if (type === 'inc') {
                new_item = new Income(id, des, val);
            }

            // Push into data structure.
            data.all_items[type].push(new_item);
            // Return new element.
            return new_item;
        },

        delete_item: function(type, id) {
            var ids, index;

            ids = data.all_items[type].map(function(current) { // map is different than forEach because map returns a whole new array.
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.all_items[type].splice(index, 1) // Splice is used to remove elements. The first number is the position at where you want to start deleting. The second number is the amount of things you want deleted.
            };
        },

        calculate_budget: function() {
            // 1. calculate total income and expenses
            calculate_total('exp');
            calculate_total('inc');
            // 2. calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // 3. calculate the percentage of the income that we spend.
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            };
        },
        get_budget: function() {
            return {
                budget: data.budget, 
                total_inc: data.totals.inc,
                total_exp: data.totals.exp,
                percentage: data.percentage,
            }
        },
        calculate_percentage: function() {
           data.all_items.exp.forEach(function(current) {
                current.calc_percentage(data.totals.inc);
           });
        },
        get_precentages: function() {
            var all_precentages = data.all_items.exp.map(function(current) {
                return current.get_precentage();
            });
            return all_precentages;
        },
        testing: function() {
            console.log(data);
        }
    };
})();


// UI Controller 
var UI_controller = (function() {

    var DOM_strings = { // We are typing this becuase if the values are to change, we do not need to comb through the code to make changes. We are removing the hardcoded elements.
        input_type: '.add__type',
        input_description: '.add__description',
        input_value: '.add__value',
        input_btn: '.add__btn',
        income_container: '.income__list',
        expenses_container: '.expenses__list',
        budget_label: '.budget__value',
        income_label :'.budget__income--value',
        expense_label: '.budget__expenses--value',
        percentage_label: '.budget__expenses--percentage',
        container: '.container',
        expenses_item_percentage: '.item__percentage',
        date_label: '.budget__title--month',
    };
    var format_number = function(number, type) {
        var num_split, int, dec;
        number = Math.abs(number);
        number = number.toFixed(2); // This will turn something from 2.4567 -> 2.46 or 2 -> 2.00
        num_split = number.split('.'); // Start search at .
        int = num_split[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); // => substr(0, 1) => Start at position 0 and only read one number 2456.78 -> 2
        }
        dec = num_split[1];
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };
    var nodelist_foreach = function(nodelist, callback) { // On each iteration is going to call our callback function.
        for (var i = 0; i < nodelist.length; i++) {
            callback(nodelist[i], i); // This is an example to show the power of first class functions.
        }
    };
    return { // We want to get some type of input so we need to do that in the return object.
        getinput: function() {
            return {
                type: document.querySelector(DOM_strings.input_type).value, // Will be either inc or exp
                description: document.querySelector(DOM_strings.input_description).value,
                value: parseFloat(document.querySelector(DOM_strings.input_value).value), // parseFloat made the string a number
            };
        },
        add_list_item: function(obj, type) { // Pushing html entries to html page.
            var html, new_html, element
            // 1. Create HTML string with placeholder text.
            if (type === 'inc') {
                element = DOM_strings.income_container;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOM_strings.expenses_container
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            // 2. Replace placeholder text with data.
            new_html = html.replace('%id%', obj.id, '%description%',);
            new_html = new_html.replace('%description%', obj.description);
            new_html = new_html.replace('%value%', format_number(obj.value, type));
            // 3. Insert HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', new_html);
        },
        delete_list_item: function(id) {
            var element =  document.getElementById(id);
            element.parentNode.removeChild(element); // removeChild only removes a child, so we are moving out one and selecting the child from the parent node.
        },
        clear_field: function() {
            var fields, fields_array;
            fields = document.querySelectorAll(DOM_strings.input_description + ', ' + DOM_strings.input_value); // Selecting the feilds that need to be abjusted. 

            fields_array = Array.prototype.slice.call(fields); // Accessing the fields to be cleared.

            fields_array.forEach(function(current, index, array) { // Clears out the inputs. 
                current.value = "";
            });
            fields_array[0].focus(); // Makes the browser focus on the first input.
        },
        display_budget: function(obj) {
            var type
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOM_strings.budget_label).textContent = format_number(obj.budget, type);
            document.querySelector(DOM_strings.income_label).textContent = format_number(obj.total_inc, 'inc');
            document.querySelector(DOM_strings.expense_label).textContent = format_number(obj.total_exp, 'exp');
            

            if (obj.percentage > 0) {
                document.querySelector(DOM_strings.percentage_label).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOM_strings.percentage_label).textContent = '___';
            }
        },
        display_percentages: function(percentage) {
            var fields = document.querySelectorAll(DOM_strings.expenses_item_percentage);
            nodelist_foreach(fields, function(current, index) { // Note that nodelist_foreach is assigned to the callback parameter and is used.
                if (percentage[index] > 0) {
                    current.textContent = percentage[index] + '%';
                } else {
                    current.textContent = '___'
                };
            });
        },
        display_method: function() {
            var now, year, month, day, last_num;
            now = new Date(); // You can also do something like this.. var christmas = new Date(2020, 11, 25);
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December']
            month = now.getMonth();
            day = now.getDate();
            last_num = day.toString().slice(-1)
            if (last_num === '1') {
                day = day + 'st'
            } else if (last_num === '2') {
                day = day + 'nd'
            }else if (day === '3') {
                day = last_num + 'rd'
            } else {
                day = day + 'th'
            };
            document.querySelector(DOM_strings.date_label).textContent = months[month] + ' ' + day + ', ' + year;
        },
        change_type: function() {
            var list = document.querySelectorAll(
            DOM_strings.input_type + ',' + 
            DOM_strings.input_description + ',' + 
            DOM_strings.input_value);
            nodelist_foreach(list, function(current) {
                current.classList.toggle('red-focus'); // Toggles the select and inputs red.
            });
            document.querySelector(DOM_strings.input_btn).classList.toggle('red'); // Toggles the button red.
        },
        get_DOM_strings: function() {
            return DOM_strings;
        },
    };
})();

// Global App Controller
var app_controller = (function(budget_ctr, UI_ctr) { // This is always what tells the other modules what to do.
    var setup_event_listeners = function() {
        var DOM = UI_ctr.get_DOM_strings(); // Retreaving DOM Strings to use them here.
        document.querySelector(DOM.input_btn).addEventListener('click', ctrl_add_item); // You don't need to do ctrl_add_item(), just ctrl_add_item because this is a callback function.
        document.addEventListener('keypress', function(event) { // This allows us to find the keys that are pressed, like enter.
            if (event.keycode === 13 || event.which === 13) {
                ctrl_add_item();
            };
        });
        document.querySelector(DOM.container).addEventListener('click', ctrl_delete_item);
        document.querySelector(DOM.input_type).addEventListener('change', UI_ctr.change_type);
    };
    var update_budget = function() {
        // 1. Calculate the budget
        budget_ctr.calculate_budget();
        // 2. Return the budget
        var budget = budget_ctr.get_budget();
        // 3. Display the budget on the UI
        UI_ctr.display_budget(budget);
    };

    var update_percentages = function() {
        // 1. Calculate the percentages.
        budget_ctr.calculate_percentage();
        // 2. Read percentages from the budget controller.
        var percentages = budget_ctr.get_precentages();
        // 3. Update the user interface with new percentages.
        UI_ctr.display_percentages(percentages);
    }

    var ctrl_add_item = function() {
        var input, new_item
        // 1. Get the field input data
        input = UI_ctr.getinput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // It should not be not a number and bigger than zero.
            // 2. Add the item to the budget controller
            new_item = budget_controller.add_item(input.type, input.description, input.value);
            // 3. Add the new item to the UI 
            UI_ctr.add_list_item(new_item, input.type);
            // 4. Clear the fields
            UI_ctr.clear_field();
            // 5. Calculate and update budget
            update_budget();
            // 6. Calculate and update percentages.
            update_percentages();
        };
    };
    var ctrl_delete_item = function(event) {
        var item_id, split_id, type, id;
        item_id = event.target.parentNode.parentNode.parentNode.parentNode.id; // parentNode alows us to move outside of the node to the parent node.
        if (item_id) {
            split_id = item_id.split('-'); // This allows you to take a string (a primative) and basically turn it into an object by using split.
            type = split_id[0].substring(0, 3); // substring used used to take just the first three parts of the string.
            id = parseInt(split_id[1]); // We are using parseInt to convert a string to an integer.

            // 1. Delete the item from the data structure
            budget_ctr.delete_item(type, id);
            // 2. Delete the item from the UI
            UI_ctr.delete_list_item(item_id);
            // 3. Update and show the new budget
            update_budget();
            // 4. Calculate and update percentages.
            update_percentages();
        } else {

        };
    };


    return {
        init: function() {
            //console.log('Application has started.');
            UI_ctr.display_method();
            UI_ctr.display_budget({
                    budget: 0, 
                    total_inc: 0,
                    total_exp: 0,
                    percentage: -1
                }
            );
            setup_event_listeners();
        }
    };

})(budget_controller, UI_controller);

app_controller.init();