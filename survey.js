// Đối Tượng `Validator`
function Validator(options) {
    // tìm kiếm element cha
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    // lưu các rule của input
    var selectorRules = {};
    var formElement = document.querySelector(options.form);// lấy phần tử trong ID `form-surver`
    // Thực hiện sử lý và show lỗi 
    function Validate(inputElement,rule){
        var errorElement = getParent(inputElement,options.parentSelector).querySelector(options.errorSelector)
        var errormessage ; // lấy giá trị người dùng nhập vô
        //  lấy các rules của selector 
        var rules = selectorRules[rule.selector];
            // lặp qua các rule & kiểm tra 
            // nếu cố lỗi thì kiểm tra và thoát
        for(var i = 0; i < rules.length;++i) {
            switch(inputElement.type){
                case 'checkbox':
                    errormessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                case 'radio':
                    errormessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errormessage = rules[i](inputElement.value)
            }
            
            if(errormessage) break;
            console.log(errormessage);
        }
                    
        if(errormessage){
             errorElement.innerText = errormessage;
           // inputElement.parentElement.classList.add('was-validated');
        }else{
             errorElement.innerText = '';
           //  inputElement.parentElement.classList.remove('was-validated');
         }
         return !errormessage;
    }
    // Lây element của from cần Validate    
    if(formElement){
        // lấy element của form cần validate 
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            // lặp qua từng rule và Validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = Validate(inputElement, rule);
               if(!isValid){
                    isFormValid = false;
               }
            });
            
            // xử lú nút Submit form
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]');//
                    // lăp qua các phẩn tử của form
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        // lấy value của input và checkbox 
                        switch(input.type){
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                                case 'file':
                                    values[input.name] = input.files;
                                    break;
                            default:
                                values[input.name] = input.value;
                        }
                        
                        return values;
                    },{});//Convert sang array 
                    
                    options.onSubmit(formValues);
                }
            }
        }

        // Lặp qua mỗi rule lắng nghe sự kiện 
            options.rules.forEach(function(rule){
            // forEach method called function for each element in an array.

            // Lưu lại các role cho mỗi input 
                if(Array.isArray(selectorRules[rule.selector])){
                    selectorRules[rule.selector].push(rule.test);
                }else{
                    selectorRules[rule.selector] = [rule.test];
                }
            var inputElements = formElement.querySelectorAll(rule.selector); // chỉ định lấy selector trong from đưa vào
            Array.from(inputElements).forEach(function(inputElement){
                // xử lý mỗi khi người dùng blur
                inputElement.onblur = function(){
                    Validate(inputElement, rule);
                }

                 // xử lý mỗi khi người dùng nhập lại vô input 
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement,options.parentSelector).querySelector(options.errorSelector)
                    errorElement.innerText = '';
                 }
            });
            
        });
        
    }
}
// Định nghĩa các Rule 
Validator.isRequired = function(selector, Message){
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : Message || "Vui lòng nhập họ tên";
        }
    }
}


Validator.isEmail = function(selector, Message){

    return {
        selector: selector,
        test: function (value){
            var check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return check.test(value) ? undefined : Message || "Bạn đã nhập sai email";
        }
    }
}
Validator.isPassword = function(selector,Message){

    return {
        selector: selector,
        test: function (value){
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            return passw.test(value) ? undefined : Message || "Mật khẩu từ 6-20 kí tự có ít nhất một số, một chữ thường và một chữ hoa";
        }
    }
}
Validator.isConfirmPassword = function(selector,Confirm,Message){

    return {
        selector: selector,
        test: function (value){
            return value === Confirm() ? undefined : Message || "Mật khẩu không khớp";
        }
    }
}
Validator.isPhone = function(selector,Message){

    return {
        selector: selector,
        test: function (value){
            var phoneno = /^\d{10}$/;
            return phoneno.test(value) ? undefined : Message || "Vui lòng nhập đúng số điện thoại"
        }
    }
}
Validator.isAge = function(selector, minage, Message){

    return {
        selector: selector,
        test: function (value){
            return value >= minage ? undefined : Message || "Tuổi của bạn chưa đủ để tham gia"
        }
    }
}

Validator.isRecommentRadio = function(selector, Message){
    return {
        selector: selector,
        test: function (value){
            return value ? undefined : Message || "Vui lòng chọn một phương thức";
        }
    }
}
