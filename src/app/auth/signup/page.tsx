import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import PhoneInput, { isValidPhoneNumber, type Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useAuthContext } from '@/context/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Seo } from '@/components/seo';
import { PAGE_SEO } from '@/constants/seo';

const signupSchema = z.object({
  email: 
    z.email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => isValidPhoneNumber(val), 'Please enter a valid phone number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage(): React.JSX.Element {
  const { signup } = useAuthContext();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<Value>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const formData = { email, phone: phone ?? '', password, confirmPassword };
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupFormData;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const phoneForApi = phone?.replace('+', '') ?? '';

    signup({ email, phone: phoneForApi, password })
      .then((message: string) => {
        setSuccessMessage(message);
      })
      .catch((err: Error) => {
        setErrors({ email: err.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (successMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Seo
          title={PAGE_SEO.signup.title}
          description={PAGE_SEO.signup.description}
          path={PAGE_SEO.signup.path}
        />
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Success</CardTitle>
            <CardDescription className="text-center">
              {successMessage}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link to="/">
              <Button variant="outline">Back to login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Seo
        title={PAGE_SEO.signup.title}
        description={PAGE_SEO.signup.description}
        path={PAGE_SEO.signup.path}
      />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <PhoneInput
                international
                defaultCountry="ZA"
                value={phone}
                onChange={setPhone}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-sm text-muted-foreground text-center pt-6">
              Already have an account?{' '}
              <Link to="/" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
