interface SignUpModel {
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    contactNo: string,
    profilePic: string; // Base64-encoded string
    employeeDetailId: number,
    roleId: number
}

export default SignUpModel