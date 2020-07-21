import React from 'react';

import LoginButton from './LoginButton';

import Google from '../images/btn_google_light_normal_ios.svg';

const GoogleLoginButton = () => (
    <LoginButton
        icon={Google}
        alt="Google"
        href="/auth/google"
        text="Sign in to Google"
    />
);

export default GoogleLoginButton;
