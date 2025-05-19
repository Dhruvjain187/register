import { useState } from "react"
import axios from "axios"

function App() {

  const [data, setData] = useState({
    fullname: "",
    dob: "",
    gender: "male",//by default
    profile: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: ""
  })

  function validateAge() {
    const dob = data.dob;

    let today = new Date();
    let birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();


    if (age >= 18) {
      return true
    }

    return false
  }

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatefullname = (fullname) => {
    const regex = /^[A-Za-z]+$/;
    return regex.test(fullname);
  };

  const validatenumber = (number) => {
    const regex = /^\d{10}$/;
    return regex.test(number);
  };

  const validatepassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };



  const formHandler = async (e) => {
    e.preventDefault()
    // console.log("submitted")
    if (validateAge() && validateEmail(data.email) && validatefullname(data.fullname
      && data.gender.length !== 0 && data.profile && validatenumber(data.number) && validatepassword(data.password)
    )) {
      const formData = new FormData();

      formData.append('data.fullname', data.fullname);
      formData.append('data.dob', data.dob);
      formData.append('data.gender', data.gender);
      formData.append('data.profile', data.fullname);
      formData.append('data.email', data.email);
      formData.append('data.number', data.number);
      formData.append('data.password', data.password);

      // console.log(formData)
      // axios.post("http://localhost:5173/register", {
      //   data
      // })
      //   .then(function (response) {
      //     console.log(response)
      //   })
      //   .catch(function (err) {
      //     console.log(err)
      //   })

      axios.get("http://localhost:3000/")
        .then(function (response) {
          console.log(response)
        })
        .catch(function (err) {
          console.log(err)
        })
    }
    // console.log(validateAge())
    // console.log(validateEmail(data.email))
  }

  const onChangeData = (e) => {
    console.log(e.target.name, e.target.value)
    setData((prev) => {
      return {
        ...prev, [e.target.name]: e.target.value
      }
    })
  }

  const handleFileChange = (e) => {
    setData((prev) => {
      return { ...prev, profile: e.target.files[0] }
    });
  };

  console.log(data)

  return (
    <>
      <form
        onSubmit={formHandler}>
        <label htmlFor="fullname">Fullname</label>
        <input type="text" id="fullname" name="fullname" value={data.fullname} onChange={onChangeData} />

        <label htmlFor="dob">dob</label>
        <input type="date" id="dob" name="dob" value={data.dob} onChange={onChangeData} />

        <label htmlFor="email">email</label>
        <input type="email" id="email" name="email" value={data.email} onChange={onChangeData} />


        <div>
          <label>gender</label>
          <input
            checked={data.gender === "male"}
            onChange={onChangeData}
            type="radio" id="male" name="gender" value="male" />
          <label htmlFor="male">male</label>

          <input
            checked={data.gender === "female"}
            onChange={onChangeData}
            type="radio" id="female" name="gender" value="female" />
          <label htmlFor="female">female</label>
        </div>

        <label htmlFor="profile">profile</label>
        <input type="file" id="profile" name="profile"
          // value={data.fullname}
          onChange={handleFileChange}
        />

        <label htmlFor="number">Number</label>
        <input type="text" id="number" name="number" value={data.number} onChange={onChangeData} />

        <label htmlFor="password">password</label>
        <input type="password" id="password" name="password" value={data.password} onChange={onChangeData} />

        <label htmlFor="confirmPassword">confirm password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={data.confirmPassword} onChange={onChangeData} />

        <button
          type={data.password === data.confirmPassword ? "submit" : "button"}>Submit</button>
      </form>
    </>
  )
}

export default App
