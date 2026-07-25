import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Get In Touch</h1>
          <p className="text-slate-400 text-lg">
            Questions, feedback, or just want to connect?
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-8 hover:border-cyan-400/30 transition-all group"
          >
            <Github className="w-12 h-12 text-slate-400 group-hover:text-cyan-400 mx-auto mb-4 transition-colors" />
            <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
            <p className="text-sm text-slate-400">View my projects</p>
          </a>

          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-8 hover:border-indigo-400/30 transition-all group"
          >
            <Linkedin className="w-12 h-12 text-slate-400 group-hover:text-indigo-400 mx-auto mb-4 transition-colors" />
            <h3 className="text-lg font-semibold text-white mb-2">LinkedIn</h3>
            <p className="text-sm text-slate-400">Connect professionally</p>
          </a>

          <a
            href="mailto:your.email@example.com"
            className="glass-card p-8 hover:border-emerald-400/30 transition-all group"
          >
            <Mail className="w-12 h-12 text-slate-400 group-hover:text-emerald-400 mx-auto mb-4 transition-colors" />
            <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
            <p className="text-sm text-slate-400">Send me a message</p>
          </a>
        </div>

        {/* Footer */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            <span>by Harishhh</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            SystemStream • A Linux Telemetry Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
