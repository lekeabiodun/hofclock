import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

const AboutDialog = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>About Flip Clock</DialogTitle>
                    <DialogDescription>
                        A beautiful flip clock application
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 my-4 text-sm">
                    <p>
                        <strong>Version:</strong> 1.0.0
                    </p>
                    <p>
                        <strong>Features:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Real-time flip clock animation</li>
                        <li>Countdown timer functionality</li>
                        <li>Fullscreen mode support</li>
                        <li>Customizable options</li>
                        <li>Responsive design</li>
                    </ul>
                    <p className="text-muted-foreground">
                        Built with React, Vite, and shadcn/ui
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AboutDialog
