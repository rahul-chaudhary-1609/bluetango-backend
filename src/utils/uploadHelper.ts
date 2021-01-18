import fs from 'fs'

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
