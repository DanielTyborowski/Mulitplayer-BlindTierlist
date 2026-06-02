import './ItemCard.css';
import RoundCounter from '../RoundCounter/RoundCounter';


const ItemCard = ({item, index}) =>{

    

    return(
        <div className='itemCardContainer'>
            <div className='itemImage'>
                <img className='itemImg' src={`http://localhost:2500${item.img}`}></img>
            </div>
            <div className='itemCardTextContainer'>
                <div className='itemName'>{item.name}</div>
                <RoundCounter counter={index}></RoundCounter>
            </div>
            
        </div>
    )

}


export default ItemCard;