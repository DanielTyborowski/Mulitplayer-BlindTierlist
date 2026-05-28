import './PickNumber.css'


const PickNumber = ({}) =>{

    return(
        <div className='pickNumberContainer'>
            {Array.from({length:10}).map((_,i) =>(
                <button key={i} className='numberBlock'>{10-i}</button>
            ))}


          

        </div>
    )

}

export default PickNumber;