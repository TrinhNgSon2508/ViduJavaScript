function Validator(options){

    var selectorRules = {};


//Hàm thực hiện Validate
    function validate(inputElement, rule){
        
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        
        //lăp qua từng rule và kiểm tra
        //Nếu có lỗi thì dừng kiểm tra 
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");

        }else{
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }

        return !errorMessage;
    };
    //Lấy Element của form cần validate
    var formElement = document.querySelector(options.form);
    

    if(formElement){
        //
        formElement.onsubmit = function (e){
            e.preventDefault();

            var isFormValid = true; 

            //lặp qua từng rule và validate
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector); 
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                //Submit với JavaScript
                if(typeof options.onSubmit === "function"){
                    var enableInputs = formElement.querySelectorAll("[name]");
                    var formValues = Array.from(enableInputs).reduce(function (value,input){
                        return (value[input.name] = input.value) && value;
                    },{});
                    options.onSubmit(formValues);
                }
                // Submit với hành vi mặc định 
                else{
                    formElement.submit();
                }
            }


        }


        options.rules.forEach(function (rule){

            //Lưu lại các rule cho mỗi input
            
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }
            
            

            var inputElement = formElement.querySelector(rule.selector); 

            if(inputElement){
                //xử lí trường hợp blur ra input
                inputElement.onblur = function (){
                    validate(inputElement,rule);
                }
                // xủ lý trường hợp người dùng nhập vào input
                inputElement.oninput = function (){
                    var errorElement = inputElement.parentElement.querySelector(".form-message");
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove("invalid");
                }
            }
        });

    }

}

Validator.isRequired = function (selector, message){
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : message || "Vui lòng nhập trường này!"
        }
    }
    
}
Validator.isEmail = function (selector,message){
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Vui lòng nhập email";
        }
    }
}

Validator.minLength = function (selector, min, message){
    return {
        selector: selector,
        test: function (value){
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function (selector, getCofirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getCofirmValue() ? undefined : message || "Giá trị nhập vào không chính xác";
        }
    }
}