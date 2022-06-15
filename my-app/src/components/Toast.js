
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastEvent = ({res,resJson}) => {
    //Oblusga defaultowa tosta
    if (res === 'defaultValue'){
        return toast.warn('Something went wrong!')
    }
    if (res === 'Sign out'){
        return toast.success('Successful sign out')
    }
    if (res === 'SignUpForLecture'){
        return toast.warn(resJson)
    }
    //Obsluga toasta w przypadku kiedy 'res' jest typu Responde
    if (res.res instanceof Response){
        if(resJson.error_message){
            return toast.error(resJson.error_message)
        }
        switch (res.res.status/100){
            case 2:
                if(resJson.access_token){
                    return toast.success('Succesful sign in')
                }
                return toast.success(resJson.message)
            case 5:
                return toast.warn(resJson.message)
            default:
                return toast.warn('Something went wrong with responde')
        }
    }
    return toast('Default toast');
}

export default toastEvent
