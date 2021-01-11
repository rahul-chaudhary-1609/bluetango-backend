import fs from 'fs'
import Stream from 'stream'
import azure from 'azure-storage'

export const deleteTempFile = (filePath) => {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
    }

    fs.unlink(filePath, (e) => {
      if (e) {
        console.log(e);
      }
      console.log("file deleted successfully");
    });
  });
}

export const uploadToAzure = (file) => {
  return new Promise((resolve, reject) => {
    let file_location = file.path;
    let folder_name;
    if(file.fieldname == 'avatar') {
      folder_name = 'profiles'
    } else {
      folder_name = 'documents'
    }
    let file_name = `${folder_name}/${file.filename}`;
    azure
    .createBlobService(process.env.AZURE_STORAGE_NAME, process.env.AZURE_STORAGE_KEY) 
    .createBlockBlobFromLocalFile(process.env.AZURE_CONTAINER_NAME, file_name, file_location, function (error, result, response) {
      if(error) {
        reject(error)
      } else {
        const resp = {
          url: `https://${process.env.AZURE_STORAGE_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${file_name}`
        }
        resolve(resp)
      }
    });
  });
}


export const uploadFile = (file: any) => {
  return new Promise((resolve, reject) => {
    uploadToAzure(file)
      .then((data) => {
        deleteTempFile(file.path);
        resolve(data)
      }).catch(err => {
          deleteTempFile(file.path);
          reject(err);
      })
  })
}

