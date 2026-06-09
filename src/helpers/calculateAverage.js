module.exports= function calculateAverage(ratings){
    if(!ratings||ratings.length === 0){
        return 0;
    }
    const total=ratings.reduce((sum,rating)=> sum+rating.value,0);
    return total/ratings.length;
}