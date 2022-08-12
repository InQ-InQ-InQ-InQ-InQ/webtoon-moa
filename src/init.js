/**
 * 크롤링한 데이터 DB에 최초 삽입을 위한 코드
 */

const xlsx = require('xlsx');
const path = require('path');
const db = require('./config/db');

function initCrawlingDataToDB(){
    //데이터 DB에 넣기
    const webtoonList = getWebtoonList();
    for(const webtoon of webtoonList){
        const sql = `INSERT INTO webtoon (id, title, author, img_url, web_url, platform_name, genre_name, week, click_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        db.query(sql, 
            [webtoon.id, webtoon.title, webtoon.author, webtoon.img_url, webtoon.web_url, webtoon.platform_name, webtoon.genre_name, webtoon.week, 0], 
            function(error, results){
            if(error) console.log(error);
        });
    }
}

function getWebtoonList(){
    const excelData = xlsx.readFile(path.join(__dirname, '/public/webtoon-list.xlsx'));
    return convertExcelToJson(excelData);
}

function convertExcelToJson(excelData){
    const sheetNames = excelData.SheetNames;
    const totalSheets = sheetNames.length;

    let parsedData = [];
    for (let i = 0; i < totalSheets; i++) {
        const tempData = xlsx.utils.sheet_to_json(excelData.Sheets[sheetNames[i]]);
        tempData.shift();
        parsedData.push(...tempData);
    }
    return parsedData;
}

initCrawlingDataToDB();