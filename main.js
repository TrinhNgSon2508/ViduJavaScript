function Validator(options){
//Hàm thực hiện Validate
    function validate(inputElement, rule){
        
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");

        }else{
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove("invalid");
        }
    };
    //Lấy Element của form cần validate
    var formElement = document.querySelector(options.form);
    

    if(formElement){
        options.rules.forEach(function (rule){
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

Validator.isRequired = function (selector){
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : "Vui lòng nhập trường này!"
        }
    }
    
}
Validator.isEmail = function (selector){
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Vui lòng nhập email";
        }
    }
}

Validator.minLength = function (selector, min){
    return {
        selector: selector,
        test: function (value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}