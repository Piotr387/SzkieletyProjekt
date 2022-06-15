import UserLectures from './UserLectures';
import UserAccountDetails from './UserAccountDetails'
import UserUpdateEmail from './UserUpdateEmail'
import UserOtherList from './UserOtherList';

const UserRole = () => {

    return (
        <>
            <hr></hr>
            <UserLectures />
            <hr></hr>
            <UserAccountDetails />
            <hr></hr>
            <UserUpdateEmail />
            <hr></hr>
            <UserOtherList />
            <hr></hr>
        </>
    )
}

export default UserRole
