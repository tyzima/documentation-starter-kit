import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const config: DocsThemeConfig = {
  logo: <span>lax.docs</span>,
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – lax.docs'
    }
  },
  wrapper: ({ children }) => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const supabase = createClientComponentClient()

    useEffect(() => {
      const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session && router.pathname !== '/login') {
          router.push('/login')
        } else {
          setIsAuthenticated(true)
        }
      }

      checkUser()
    }, [router])

    if (!isAuthenticated && router.pathname !== '/login') {
      return null // or a loading spinner
    }

    return <>{children}</>
  }
}

export default config