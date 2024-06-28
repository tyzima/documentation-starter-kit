import { NextResponse } from 'next/server';

export function middleware(request) {
  const password = process.env.SITE_PASSWORD; // Ensure this is set in your environment variables

  // Check if the password is correct
  if (request.cookies.get('site-password') === password) {
    return NextResponse.next(); // Password is correct, allow the request
  }

  // If the password is not correct, check the submitted password
  const { searchParams } = new URL(request.url);
  const submittedPassword = searchParams.get('password');

  if (submittedPassword === password) {
    const response = NextResponse.next();
    // Set a cookie to remember the password
    response.cookies.set('site-password', password, { maxAge: 60 * 60 * 24 });
    return response;
  }

  // If the password is not submitted or incorrect, show the password prompt
  return new NextResponse(
    `<html>
      <body>
        <form method="get">
          <label>Password:</label>
          <input type="password" name="password" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
