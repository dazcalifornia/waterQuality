import csvtojson from 'csvtojson';

interface CSVRow {
  [key: string]: string;
}

async function readCSVFile(filePath: string): Promise<CSVRow[]> {
  const rows = await csvtojson().fromFile(filePath);
  return rows;
}

export default readCSVFile;

