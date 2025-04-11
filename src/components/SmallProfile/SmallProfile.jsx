import "./small-profile-styles.css"
import StarRating from "../StarRating/StarRating";
export default function SmallProfile(props){
    var name = props.name;

    return <div className="flex-container align-left">
        <a href="#" className="img-container"><img className="profile-img" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"></img></a>
        <button className="user-name">{name}</button>
        <div><StarRating star="4.4"/></div>
    </div>
}