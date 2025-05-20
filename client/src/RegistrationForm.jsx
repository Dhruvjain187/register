import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            dateOfBirth: '',
            gender: '',
            email: '',
            mobileNumber: '',
            password: '',
            confirmPassword: ''
        }
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileError, setFileError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState({ status: '', message: '' });

    const getMaxDate = () => {
        const today = new Date();
        const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        );
        return eighteenYearsAgo.toISOString().split('T')[0];
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError('');

        if (!file) {
            setSelectedFile(null);
            setPreviewImage(null);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setFileError('Only JPEG or PNG images are allowed');
            setSelectedFile(null);
            setPreviewImage(null);
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFileError('Image must be smaller than 2MB');
            setSelectedFile(null);
            setPreviewImage(null);
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data) => {
        if (!selectedFile) {
            setFileError('Profile image is required');
            return;
        }

        setIsSubmitting(true);
        setSubmitResult({ status: '', message: '' });

        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            formData.append('profile', selectedFile);
            console.log("formdata=", data, selectedFile)

            const response = await axios.post('http://localhost:3000/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSubmitResult({
                status: 'success',
                message: 'Registration successful!'
            });

            reset();
            setSelectedFile(null);
            setPreviewImage(null);

        } catch (error) {
            console.error('Registration error:', error);

            let errorMessage = 'Registration failed. Please try again.';
            if (error.response && error.response.data && error.response.data.errors) {
                const serverErrors = error.response.data.errors;
                errorMessage = serverErrors.map(err => `${err.message}`).join(', ');
            }

            setSubmitResult({
                status: 'error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Registration Form</h1>

            {submitResult.status && (
                <div className={`alert ${submitResult.status}`} role="alert">
                    {submitResult.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
                {/* Full Name */}
                <div className="form-group">
                    <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="fullName"
                        aria-describedby="fullNameError"
                        aria-invalid={errors.fullName ? "true" : "false"}
                        {...register("fullName", {
                            required: "Full name is required",
                            pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: "Only alphabetical characters and spaces allowed"
                            }
                        })}
                    />
                    {errors.fullName && (
                        <span id="fullNameError" className="error-message" role="alert">
                            {errors.fullName.message}
                        </span>
                    )}
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth <span className="required">*</span></label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        max={getMaxDate()}
                        aria-describedby="dobError"
                        aria-invalid={errors.dateOfBirth ? "true" : "false"}
                        {...register("dateOfBirth", {
                            required: "Date of birth is required",
                            validate: value => {
                                const dob = new Date(value);
                                const today = new Date();
                                const age = today.getFullYear() - dob.getFullYear();
                                const monthDiff = today.getMonth() - dob.getMonth();

                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                                    return age - 1 >= 18 || "You must be at least 18 years old";
                                }

                                return age >= 18 || "You must be at least 18 years old";
                            }
                        })}
                    />
                    {errors.dateOfBirth && (
                        <span id="dobError" className="error-message" role="alert">
                            {errors.dateOfBirth.message}
                        </span>
                    )}
                </div>

                {/* Gender */}
                <div className="form-group">
                    <fieldset>
                        <legend>Gender <span className="required">*</span></legend>
                        <div className="radio-group">
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="male"
                                    value="Male"
                                    aria-describedby="genderError"
                                    {...register("gender", { required: "Gender selection is required" })}
                                />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="radio-option">
                                <input
                                    type="radio"
                                    id="female"
                                    value="Female"
                                    aria-describedby="genderError"
                                    {...register("gender", { required: "Gender selection is required" })}
                                />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                        {errors.gender && (
                            <span id="genderError" className="error-message" role="alert">
                                {errors.gender.message}
                            </span>
                        )}
                    </fieldset>
                </div>

                {/* Profile Image Upload */}
                <div className="form-group">
                    <label htmlFor="profileImage">Profile Image <span className="required">*</span></label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            aria-describedby="imageError"
                            aria-invalid={fileError ? "true" : "false"}
                        />
                        <p className="file-hint">JPEG or PNG files only, max 2MB</p>

                        {previewImage && (
                            <div className="image-preview">
                                <img src={previewImage} alt="Profile preview" />
                            </div>
                        )}

                        {fileError && (
                            <span id="imageError" className="error-message" role="alert">
                                {fileError}
                            </span>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email <span className="required">*</span></label>
                    <input
                        type="email"
                        id="email"
                        aria-describedby="emailError"
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Please enter a valid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <span id="emailError" className="error-message" role="alert">
                            {errors.email.message}
                        </span>
                    )}
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                    <label htmlFor="mobileNumber">Mobile Number <span className="required">*</span></label>
                    <input
                        type="tel"
                        id="mobileNumber"
                        aria-describedby="mobileError"
                        aria-invalid={errors.mobileNumber ? "true" : "false"}
                        {...register("mobileNumber", {
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Mobile number must be exactly 10 digits"
                            }
                        })}
                    />
                    {errors.mobileNumber && (
                        <span id="mobileError" className="error-message" role="alert">
                            {errors.mobileNumber.message}
                        </span>
                    )}
                </div>

                {/* Password */}
                <div className="form-group">
                    <label htmlFor="password">Password <span className="required">*</span></label>
                    <input
                        type="password"
                        id="password"
                        aria-describedby="passwordError"
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long"
                            },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                                message: "Password must contain at least one uppercase letter, one number, and one special character"
                            }
                        })}
                    />
                    {errors.password && (
                        <span id="passwordError" className="error-message" role="alert">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password <span className="required">*</span></label>
                    <input
                        type="password"
                        id="confirmPassword"
                        aria-describedby="confirmPasswordError"
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                        {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: value => value === watch('password') || "Passwords do not match"
                        })}
                    />
                    {errors.confirmPassword && (
                        <span id="confirmPasswordError" className="error-message" role="alert">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;