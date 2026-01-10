const formatDate = (date : Date) =>{
    const realDate = new Date(date)
    const day = realDate.getDate().toString().padStart(2, '0');
    const month = (realDate.getMonth() + 1).toString().padStart(2, '0');
    const year = realDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

const utils = {
    formatDate
}
export default utils 