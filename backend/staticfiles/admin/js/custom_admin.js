
document.addEventListener('DOMContentLoaded', function() {
    console.log("Enhanced HomeFinder Admin JS loaded!");

  
    const deleteButtons = document.querySelectorAll('.deletelink');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            if (!confirm('Are you sure you want to delete this item? This action cannot be undone and may affect related data.')) {
                event.preventDefault(); 
            }
        });
    });

    

    const confirmActionButtons = document.querySelectorAll('.js-confirm-action');
    confirmActionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const message = this.dataset.confirmMessage || 'Are you sure you want to perform this action?';
            if (!confirm(message)) {
                event.preventDefault();
            }
        });
    });

   
    const addCustomUserLink = document.querySelector('a.addlink[href*="/users/customuser/add/"]');
    if (addCustomUserLink) {
        addCustomUserLink.textContent = "Register New HomeFinder User";
        addCustomUserLink.style.fontWeight = 'bold';
        addCustomUserLink.style.backgroundColor = '#007bff'; // Example: Add a specific color
        addCustomUserLink.style.color = 'white';
        addCustomUserLink.style.padding = '8px 12px';
        addCustomUserLink.style.borderRadius = '5px';
        addCustomUserLink.style.textDecoration = 'none';
        addCustomUserLink.style.display = 'inline-block';
        addCustomUserLink.style.marginLeft = '10px';
    }

   
    const searchInput = document.querySelector('#searchbar');
    if (searchInput) {
        searchInput.placeholder = 'Search by email, name, or phone...'; // More descriptive placeholder
    }

    
    const messageList = document.querySelector('.messagelist');
    if (messageList) {
        setTimeout(() => {
            // Fade out
            messageList.style.transition = 'opacity 1s ease-out';
            messageList.style.opacity = '0';
            // Then remove from DOM
            setTimeout(() => {
                messageList.remove();
            }, 1000); // Wait for fade-out to complete
        }, 5000); // 5 seconds
    }

    
    const profilePicInput = document.getElementById('id_profile_pic');
    const profilePicPreviewContainer = document.querySelector('.field-profile_pic_preview'); // Target the readonly_field container
    const profilePicImg = profilePicPreviewContainer ? profilePicPreviewContainer.querySelector('img') : null;

    if (profilePicInput && profilePicPreviewContainer) {
     
        const originalPreview = profilePicInput.closest('.form-row').querySelector('.file-upload');
        if (originalPreview) {
            originalPreview.style.display = 'none';
        }

        const previewDiv = document.createElement('div');
        previewDiv.style.marginTop = '10px';
        previewDiv.innerHTML = '<img id="profile-pic-live-preview" src="" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd; display: none;" alt="Profile Preview">';
        profilePicInput.parentNode.insertBefore(previewDiv, profilePicInput.nextSibling);

        const livePreviewImg = document.getElementById('profile-pic-live-preview');

      
        if (profilePicImg && profilePicImg.src) {
            livePreviewImg.src = profilePicImg.src;
            livePreviewImg.style.display = 'block';
        } else if (profilePicInput.dataset.initialUrl) { // For "Currently" link
             livePreviewImg.src = profilePicInput.dataset.initialUrl;
             livePreviewImg.style.display = 'block';
        }


        profilePicInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    livePreviewImg.src = e.target.result;
                    livePreviewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                livePreviewImg.style.display = 'none';
            }
        });
    }

});