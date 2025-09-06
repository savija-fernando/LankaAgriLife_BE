const pdfDocument=require('pdfkit');
const fs = require('fs'); //file system
const Inventory=require ('../models/inventory');
const { error } = require('console');

const genaratePDF= async(req,res)=>{
    try{
        const data= await Inventory.find();

        const document= new pdfDocument;
        const filePath='InventoryReport.pdf'; //creating file name
        const stream= fs.createWriteStream(filePath);  //write data on it

        document.pipe(stream); //sending pdf data into that file

        document.fontSize(20).text('Inventory report',{align:'center',underline:true});
        document.moveDown();

        document.fontSize(12).text('No  | Inventory ID | Item Name        | Stock | Price (Rs) | Date Added | Expiry Date | Threshold');
        document.moveDown();

        data.forEach((item, index) => {
            const dateAdded = new Date(item.dateAdded).toISOString().split('T')[0];
            const expiryDate = new Date(item.expiryDate).toISOString().split('T')[0];

            document
                .fontSize(11)
                .text(
                  `${index + 1}.  ${item.inventory_id} | ${item.itemName} | ${item.stockLevel} | ${item.unitPrice} | ${dateAdded} | ${expiryDate} | ${item.threshold}`
                )
                .moveDown(0.5); // adds vertical spacing between rows
        });
        document.end();

        //wait for the stream finishes
        stream.on('finish',()=>{
            res.download(filePath,(err)=>{
                if(err){
                    console.error('Error sending file:',err);
                    res.status(500).send('Error downloading file');
                }
            });
        });
    }catch(error){
        console.error('Error generating pdf:',error);
        res.status(500).send('Server error');
    }
};

module.exports=genaratePDF;