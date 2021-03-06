module Api::V1

class CommentsController < ApplicationController
    before_action :load_user, only: [:create, :destroy]

    def new
        @comment = Comment.new
        @user = User.find(params[:user_id])
    end

    def create
        @comment = @user.comments.build(comment_params)
        if @comment.save!
            render json: { status: 200 }
        else
            render json: { err:@comment, status: 403 }
        end
    end

    def index
        @comment = Comment.where(post_id: params[:post_id])
        users = []
        arr = []
        comments = []

        @comment.each do |i|
            arr.push(i.user_id)
        end

        arr.each do |i|
            @user = User.find(i)
            users.push({ username: @user.username, user_id:@user.id })
        end

        index = 0
        @comment.each do |i|
            comments.push({ 
                text: i.text,
                username: users[index][:username],
                created: i.created_at,
                id: i.id,
                user_id: users[index][:user_id],
            })
            index += 1
        end
        render json: { status: 200, comments: comments }
    end

    def destroy
        @user = User.find(params[:user_id])
        @comment = Comment.find(params[:id])
        if @comment.destroy
            render json: { status: 200 }
        else
            render json: { status: 500}
        end
    end

    private
        def comment_params
            params.permit(:text, :post_id, :user_id)
        end
 
        def load_user
            @user = User.find(params[:user_id])
        end
    end
end