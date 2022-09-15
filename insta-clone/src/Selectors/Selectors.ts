import { createSelector } from "reselect";
import { UserPage } from "../Components/UserPage/UserPage";
import { Global_state_type } from "../Redux/Store";
import { UserType } from "../Redux/Types";


const userPageFromState = (state : Global_state_type) => state.userPage

export const userPageSelector = createSelector(userPageFromState,(UserPage) => {
    if(UserPage){
        return UserPage
    }else{
        return null as unknown as UserType
    }
})