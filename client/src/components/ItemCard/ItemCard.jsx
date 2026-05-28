import './ItemCard.css';
import RoundCounter from '../RoundCounter/RoundCounter';

const ItemCard = ({item, onNext}) =>{

    console.log(item.img);
    
    return(
        <div className='itemCardContainer'>
            <div className='itemImage'>
                <img className='itemImg' src={item.img}></img>
            </div>
            <div className='itemCardTextContainer'>
                <div className='itemName'>{item.name}</div>
                <RoundCounter onNext={onNext}></RoundCounter>
            </div>
            
        </div>
    )

}


export default ItemCard;