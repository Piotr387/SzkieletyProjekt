const UserList = ({ listOfUsers }) => {

  const userDetails = (userDetails) => {
    return <>
      <p>Login: {userDetails.login}</p>
      <p>Email: {userDetails.email}</p>
      <hr />
    </>
  }
  return (
    <div>
      {listOfUsers.length > 0 ? listOfUsers.map(element => userDetails(element)): <p>No users taking part in lecture</p>}
    </div>
  )
}

export default UserList
