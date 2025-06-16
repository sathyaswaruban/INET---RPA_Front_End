// components/SiteFooter.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Instagram, Github, Youtube } from "lucide-react";

export function Footer() {
  const { theme } = useTheme();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Case Studies", href: "/case-studies" },
        { name: "Updates", href: "/updates" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "News", href: "/news" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "Support", href: "/support" },
        { name: "API", href: "/api" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
        { name: "Licenses", href: "/licenses" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#" },
    { icon: <Twitter className="h-5 w-5" />, href: "#" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { icon: <Instagram className="h-5 w-5" />, href: "#" },
    { icon: <Github className="h-5 w-5" />, href: "#" },
    { icon: <Youtube className="h-5 w-5" />, href: "#" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className=" w-full  ">
      <div className="container px-4 py-12 mx-auto">
        {/* Top Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={footerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Stay Updated</h3>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="border-t border-border my-8" />

        {/* Bottom Section */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={footerVariants} className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">INET</span>
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} INET. All rights reserved.</p>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Additional Links */}
          <motion.div variants={itemVariants} className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </motion.div>
        </motion.div>

        {/* Back to Top */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="flex justify-center mt-12">
          <Button variant="outline" className="group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="mr-2">Back to top</span>
            <motion.span
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="inline-block"
            >
              ↑
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}
