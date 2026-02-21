const query = async () => {
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'supersecretpassword123' }),
    });
    const loginData = await loginRes.json();

    const cookies = loginRes.headers.getSetCookie();
    const sessionCookie = cookies.find(c => c.startsWith('session='));

    const time = Date.now();
    const articlesRes = await fetch(`http://localhost:3000/api/articles?t=${time}`, {
        headers: { 'cookie': sessionCookie, 'Cache-Control': 'no-cache' }
    });
    const articlesData = await articlesRes.json();
    console.log("Articles API returned:", JSON.stringify(articlesData, null, 2));

    const authorsRes = await fetch(`http://localhost:3000/api/authors?role=all&t=${time}`, {
        headers: { 'cookie': sessionCookie, 'Cache-Control': 'no-cache' }
    });
    const authorsData = await authorsRes.json();
    console.log("Authors API returned:", JSON.stringify(authorsData, null, 2));
}

query();
