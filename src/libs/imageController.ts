import path from 'path'
import fs from 'fs'

export const clearImage = filePath => {
    filePath = path.join(__dirname, '../public', filePath)
    fs.unlink(filePath, err => {
        if (err) {
            console.error(err)
            throw err
        }
    })
}
