
    
    let filterBtns = document.querySelectorAll('.nav__list'),
    radio = document.querySelectorAll('.radio'),
    inputField = document.getElementById('inputField'),
    addBtn = document.querySelector('.btn-add'),
    editButton = document.querySelector('.btn-edit'),
    container = document.querySelector('.container__area'),
    textInput="",
    keyTask ='key',
    keyStatus='status',
    dataStorage = localStorage.getItem(keyTask),
    todoList,
    statusList
    if(dataStorage){
       todoList = JSON.parse(dataStorage)
    }
    else{
       todoList=[]
    }
    if(localStorage.getItem(keyStatus)){
       statusList=JSON.parse(localStorage.getItem(keyStatus))
    }
    else{
       statusList=[]
    }

    // Bộ lọc list ( All / Done / Undone)
    function refineListTask(){
       for(let i in filterBtns){
           filterBtns[i].onclick = function(){
               radio[i].checked = true;
               filterBtns[i].classList.add("checked");                   
               for(let index = 0;index < filterBtns.length ; index++){
                   if(index !=i){
                       filterBtns[index].classList.remove("checked");              
                   }
               }
           }
       }

       
    }
    
    refineListTask();

    //Cập nhật biến textInput
    function updateTextInput(){
       inputField.onkeyup =function(){
            textInput = inputField.value;    
       }
    }
    updateTextInput();
    
    // Them task nek
    function addTask(){
       addBtn.onclick=()=>{
           if(textInput !=='' && textInput.trim() !==''){
               
                // Đưa todo content vừa thêm vào mảng để lưu
               todoList.push(textInput)
               // Thêm task mới vào container
               let newTask = document.createElement('div')
               newTask.className="listTask"
               newTask.innerHTML=`
               <p class="content">${textInput}</p>
               <div class="adjustTask">
                   <i class="fa-solid fa-trash remove"></i>
                   <i class="fa-solid fa-pen-to-square edit"></i>
               </div>
               `
               container.appendChild(newTask)
               statusList.push('')
               // Lưu vào localStorage
               localStorage.setItem(keyTask,JSON.stringify(todoList))
               localStorage.setItem(keyStatus,JSON.stringify(statusList))
               // Reset inputField
               inputField.value=''
               textInput = inputField.value; 

               listTaskEvent();
               removeTask();
               editTask();
              
               
           } 
           else{
               showErrorToast();
               inputField.value=''
               textInput = inputField.value; 
           }
       }

    }
    addTask();
    
    function render(){
       let allTask=[]
       for(let i in todoList){
           let stringValue= `<div class="listTask ${statusList[i]}" >
                <p class="content">${todoList[i]}</p>
                <div class="adjustTask">
                     <i class="fa-solid fa-trash remove"></i>
                     <i class="fa-solid fa-pen-to-square edit"></i>
                 </div>
             </div>`
            allTask.push(stringValue)
        }
       container.innerHTML=allTask.join('');
    }
    // let allTask = todoList.
    render();
    // Xoá task
    function removeTask(){
        let removeBtn = document.querySelectorAll('.remove')
        for(let i in removeBtn){
            removeBtn[i].onclick = ()=>{
                let thisTask = removeBtn[i].parentElement.parentElement;
                
                container.removeChild(thisTask)  
                todoList.splice(i,1)
                statusList.splice(i,1)

                localStorage.setItem(keyTask,JSON.stringify(todoList))
                localStorage.setItem(keyStatus,JSON.stringify(statusList))
            }
        }
    }
    
    removeTask();

    //Edit task
    function editTask(){
        let editBtns = document.querySelectorAll(".edit")
        for(let i in editBtns){
            // KHi click icon edit
            editBtns[i].onclick=()=>{
                // Lấy thẻ p
                let textTask = editBtns[i].parentElement.parentElement.querySelector('p')
                
                // Nut add đổi thành nút edit
                addBtn.style.display='none';
                editButton.style.display='block';
                
                // Đưa text trong thẻ p lên inputField để chỉnh sửa
                inputField.value = textTask.textContent; 
                textInput=inputField.value;
                
                // Khi click nut EDIT
                editButton.onclick=()=>{
                if(textInput !=='' && textInput.trim() !==''){

                    // Cập nhật lại todoList & localStorage
                    todoList[i]=textInput;
                    localStorage.setItem(keyTask,JSON.stringify(todoList))
                     
                    // Nội dung task (nội dung thẻ p) được cập nhật lại
                    textTask.textContent=textInput;

                    // Reset lại inputField
                    inputField.value=''
                    textInput = inputField.value; 
                   
                    // Đổi nút EDIT -> ADD
                    addBtn.style.display='block';
                    editButton.style.display='none';

                    // Sau khi đổi thành công -> Hiển thị toast thông báo tcông
                    showSuccessToast();
                }
                else{
                    showErrorToast();
                    inputField.value = textTask.textContent;
                    textInput = inputField.value; 
                }
                
                }
            }
        }
        
    }
    editTask();

   
    

    // Khi click vào task thì sẽ toggle Done
    function listTaskEvent(){
            let taskContents = document.querySelectorAll('.content')
            for(let i in taskContents){
                taskContents[i].onclick=()=>{
                taskContents[i].parentElement.classList.toggle('listDone')
                
                if(taskContents[i].parentElement.classList.contains("listDone")){
                    statusList[i]="listDone"
                }
                else{
                    statusList[i]=''   
                }
                localStorage.setItem(keyStatus,JSON.stringify(statusList))
                }
            }
    }
    listTaskEvent();

    

    //Toast function

    function toast({title='', type='', duration='3000'})
    {
        const main = document.getElementById('toast');
        const toast=document.createElement('div'); //tạo thẻ div         
            const autoRemoveToast=setTimeout(function(){
            main.removeChild(toast);
        }, 4000);
            toast.onclick=function(e){
                if(e.target.closest('.toast__close')){
                    main.removeChild(toast)
                    clearTimeout(autoRemoveToast);
                }
            }

            //thêm class ='toast toast--loại chi thì ứng với type loại nấy' vô thẻ div
            toast.classList.add('toast',`toast--${type}`); 
            //Tạo biến icons để sử dụng
            const icons={
                Success : 'fa-solid fa-circle-check',
                Error:    'fa-solid fa-triangle-exclamation'
                
            }   
            // Lấy đúng loại icon từ biến mảng icons
            const icon=icons[type];
            const delay=(duration/1000).toFixed(2);
            toast.style.animation=`fadeInLeft linear 0.4s, fadeOut linear 0.6s ${delay}s forwards`;
            //Thêm cái div toast vừa tạo ở trên vô
            toast.innerHTML=`
            
        <div class="toast__icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast__body ">
            <h3 class="toast__title">${title}</h3>
        </div>
        <div class="toast__close">
            <i class="fa-solid fa-xmark"></i>
        </div>
    
            `;
        main.appendChild(toast);  
        
    }

    function showSuccessToast(){
        toast({
        title : 'Edit successfully',
        type : 'Success',
        duration: '3000'
    });
    }

    function showErrorToast(){
        toast({
        title : 'The task box cannot empty',
        type : 'Error',
        duration: '3000'
    });
    }



