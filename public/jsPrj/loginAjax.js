$(function(){  
    alert('application started'); 
    $('loginId').on( "click", function() {
        var mobileId = $("#mobileId").val();  
        var password = $("#password").val();  
      $.ajax({  
          url:'/users/login',  
          method:'POST',  
          dataType:'json',  
          data:{'mobileId':mobileId,
                'password':password},
            
          success:function(response){  
              if(response.msg=='success'){  
              console.log('کاربر پیدا شد');  
             
              }else{  
                console.log('some error occurred try again');  
              }  
          },  
          error:function(response){  
            console.log('server error occured')  
          }  
      });  
   });  
})